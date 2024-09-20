let generatedOutput = '';

function showMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');

    messageBox.style.display = 'none';
    messageBox.classList.remove('alert-success', 'alert-danger', 'alert-warning');
    messageText.textContent = message;

    switch(type) {
        case 'success':
            messageBox.classList.add('alert-success');
            break;
        case 'warning':
            messageBox.classList.add('alert-warning');
            break;
        case 'error':
        default:
            messageBox.classList.add('alert-danger');
    }

    setTimeout(() => {
        messageBox.style.display = 'block';
    }, 250);
}

function showError(message) {
    showMessage(message, 'error');
}

function showWarning(message) {
    showMessage(message, 'warning');
}

function showSuccess(message) {
    showMessage(message, 'success');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function toggleInputFields() {
    const inputType = document.getElementById('inputType').value;
    const cidrFields = document.getElementById('cidrFields');
    const listFields = document.getElementById('listFields');

    if (inputType === 'cidr') {
        cidrFields.style.display = 'block';
        listFields.style.display = 'none';
    } else {
        cidrFields.style.display = 'none';
        listFields.style.display = 'block';
    }
}

function updateOutputCountValue() {
    const rangeValue = document.getElementById('outputCount').value;
    document.getElementById('outputCountValue').textContent = rangeValue;
}

function isValidCIDR(cidr) {
    return /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/.test(cidr) || /^[0-9a-fA-F:]+\/\d{1,3}$/.test(cidr);
}

function incrementIP(ip) {
    if (ip.kind() === 'ipv4') {
        let currentIpNumeric = ip.octets.reduce((acc, octet) => (acc << 8) + octet, 0);
        currentIpNumeric += 1;
        const nextIpOctets = [
            (currentIpNumeric >>> 24) & 0xFF,
            (currentIpNumeric >>> 16) & 0xFF,
            (currentIpNumeric >>> 8) & 0xFF,
            currentIpNumeric & 0xFF
        ];
        return new ipaddr.IPv4(nextIpOctets);
    } else if (ip.kind() === 'ipv6') {
        let parts = ip.parts.map(part => BigInt(part));
        let i = parts.length - 1;
        while (i >= 0) {
            parts[i] = parts[i] + 1n;
            if (parts[i] > 0xFFFFn) {
                parts[i] = 0n;
                i--;
            } else {
                break;
            }
        }
        return ipaddr.IPv6.parse(parts.map(part => part.toString(16)).join(':'));
    }
}

function isValidConfigFormat(inputConfig) {
    if (inputConfig.startsWith('vmess://')) {
        return true;
    } else if (inputConfig.startsWith('vless://')) {
        const regex = /vless:\/\/[^@]+@[^:]+:.+/;
        return regex.test(inputConfig);
    }
    return false;
}

function generateConfigs() {
    const inputType = document.getElementById('inputType').value;
    const inputConfig = document.getElementById('inputConfig').value;

    if (!inputConfig) {
        showWarning('لطفا کانفیگ را وارد کنید.');
        return;
    }

    if (!isValidConfigFormat(inputConfig)) {
        showWarning('کانفیگ وارد شده معتبر نیست.');
        return;
    }

    if (inputType === 'cidr') {
        modifyConfigsFromCIDR();
    } else {
        modifyConfigsFromList();
    }
}

function modifyConfigsFromCIDR() {
    const inputConfig = document.getElementById('inputConfig').value;
    const ipRanges = document.getElementById('ipRange').value.trim().split('\n').filter(range => range.trim() !== '');
    const outputCount = document.getElementById('outputCount').value;

    if (ipRanges.length === 0) {
        showWarning('لطفا حداقل یک رنج آی پی را وارد کنید.');
        return;
    }

    for (const ipRange of ipRanges) {
        if (!isValidCIDR(ipRange.trim())) {
            showWarning(`لطفا یک رنج آی پی معتبر وارد کنید: ${ipRange}`);
            return;
        }
    }

    generatedOutput = '';
    let count = 0;

    for (const ipRange of ipRanges) {
        const [ip, range] = ipaddr.parseCIDR(ipRange.trim());
        const ipType = ip.kind();

        let currentIp = ip;
        while (currentIp.match(ipaddr.parseCIDR(ipRange.trim())) && count < parseInt(outputCount)) {
            generatedOutput += replaceIPInConfig(inputConfig, currentIp);
            count++;

            if (count >= parseInt(outputCount)) {
                break;
            }

            currentIp = incrementIP(currentIp);
        }
    }

    displayResult(count);
}

function modifyConfigsFromList() {
    const inputConfig = document.getElementById('inputConfig').value;
    const ipList = document.getElementById('ipList').value.trim().split('\n').filter(ip => ip.trim() !== '');

    if (ipList.length === 0) {
        showWarning('لطفا لیست آی پی‌ را وارد کنید.');
        return;
    }

    generatedOutput = '';

    for (const ip of ipList) {
        let ipStr = ip.trim();
        if (ipaddr.isValid(ipStr)) {
            generatedOutput += replaceIPInConfig(inputConfig, ipaddr.parse(ipStr));
        } else {
            showWarning(`آی پی نامعتبر یافت شد: ${ipStr}`);
            return;
        }
    }

    displayResult(ipList.length);
}

function replaceIPInConfig(inputConfig, ip) {
    let isVmess = inputConfig.startsWith('vmess://');
    let ipStr = ip.toString();
    let result = '';

    if (isVmess) {
        let vmessConfig = JSON.parse(Base64.decode(inputConfig.replace('vmess://', '')));
        vmessConfig.add = ipStr;
        result = `vmess://${Base64.encode(JSON.stringify(vmessConfig))}\n\n`;
    } else {
        ipStr = ip.kind() === 'ipv6' ? `[${ipStr}]` : ipStr;
        const match = inputConfig.match(/^(vless:\/\/[^@]+)@([^:]+)(:.+)$/);
        const [_, start, domain, end] = match;
        result = `${start}@${ipStr}${end}\n\n`;
    }

    return result;
}

function displayResult(count) {
    const copyButton = document.getElementById('copyButton');
    const downloadButton = document.getElementById('downloadButton');

    if (generatedOutput) {
        showSuccess(`تولید ${count} کانفیگ با موفقیت انجام شد.`);
        copyButton.style.display = 'inline-block';
        downloadButton.style.display = 'inline-block';
    } else {
        showError('هیچ کانفیگی تولید نشد.');
        copyButton.style.display = 'none';
        downloadButton.style.display = 'none';
    }
}

async function loadIPRanges(service) {
    const url = `https://raw.githubusercontent.com/seramo/cdn-ip-ranges/main/${service}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`خطا در دریافت داده‌ها: ${response.statusText}`);
        }

        const data = await response.json();
        const ipRanges = data.ipv4 || [];

        if (ipRanges.length === 0) {
            showWarning('رنج آی پی موردنظر یافت نشد.');
            return;
        }

        if (service !== 'gcore') {
            const shuffledIPRanges = shuffleArray(ipRanges).slice(0, 4);
            document.getElementById('ipRange').value = shuffledIPRanges.join('\n');
        } else {
            document.getElementById('ipRange').value = ipRanges.join('\n');
        }
    } catch (error) {
        console.error(error);
        showError('خطایی در بارگیری آی‌پی‌ها رخ داد.');
    }
}

function copyToClipboard() {
    if (generatedOutput) {
        navigator.clipboard.writeText(generatedOutput.replace(/\n\n/g, '\n').trimEnd()).then(() => {
            showSuccess('کانفیگ‌ها در کلیپ‌بورد ذخیره شدند.');
        }).catch(err => {
            console.error(err);
            showError('خطا در کپی: ' + err);
        });
    }
}

function downloadOutput() {
    if (generatedOutput) {
        const blob = new Blob([generatedOutput.replace(/\n\n/g, '\n').trimEnd()], { type: 'text/plain' });
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        const fileName = `modified_configs_${date}_${time}.txt`;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
    }
}