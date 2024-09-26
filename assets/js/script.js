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
    const configListFields = document.getElementById('configListFields');

    cidrFields.style.display = 'none';
    listFields.style.display = 'none';
    configListFields.style.display = 'none';

    if (inputType === 'cidr') {
        cidrFields.style.display = 'block';
    } else if (inputType === 'list') {
        listFields.style.display = 'block';
    } else if (inputType === 'configList') {
        configListFields.style.display = 'block';
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
        showWarning('Please enter the config.');
        return;
    }

    if (!isValidConfigFormat(inputConfig)) {
        showWarning('The entered config is invalid.');
        return;
    }

    if (inputType === 'cidr') {
        modifyConfigsFromCIDR();
    } else if (inputType === 'list') {
        modifyConfigsFromList();
    } else if (inputType === 'configList') {
        modifyConfigsFromConfigsList();
    }
}

function modifyConfigsFromCIDR() {
    const inputConfig = document.getElementById('inputConfig').value;
    const ipRanges = document.getElementById('ipRange').value.trim().split('\n').filter(range => range.trim() !== '');
    const outputCount = document.getElementById('outputCount').value;

    if (ipRanges.length === 0) {
        showWarning('Please enter at least one IP range.');
        return;
    }

    for (const ipRange of ipRanges) {
        if (!isValidCIDR(ipRange.trim())) {
            showWarning(`Please enter a valid IP range: ${ipRange}`);
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
        showWarning('Please enter the IP list.');
        return;
    }

    generatedOutput = '';
    let count = 0;

    for (const ip of ipList) {
        let ipStr = ip.trim();
        if (ipaddr.isValid(ipStr)) {
            generatedOutput += replaceIPInConfig(inputConfig, ipaddr.parse(ipStr));
            count++;
        } else {
            showWarning(`Invalid IP found: ${ipStr}`);
            return;
        }
    }

    displayResult(count);
}

function modifyConfigsFromConfigsList() {
    const inputConfig = document.getElementById('inputConfig').value;
    const configList = document.getElementById('configList').value.trim().split('\n').filter(config => config.trim() !== '');

    if (configList.length === 0) {
        showWarning('Please enter the configs list.');
        return;
    }

    generatedOutput = '';
    let count = 0;

    for (const config of configList) {
        const address = extractAddressFromConfig(config.trim());
        if (address) {
            generatedOutput += replaceIPInConfig(inputConfig, address);
            count++;
        }
    }

    displayResult(count);
}

function extractAddressFromConfig(config) {
    let isVmess = config.startsWith('vmess://');
    let isVless = config.startsWith('vless://');

    if (isVmess) {
        const base64Str = config.substring(8);
        const decodedStr = Base64.decode(base64Str);
        const vmessConfig = JSON.parse(decodedStr);
        return vmessConfig.add;
    } else if (isVless) {
        const regex = /vless:\/\/([^@]+)@([^:]+):(\d+)(\?[^#]*)?(#.*)?/;
        const match = config.match(regex);
        const address = match[2];
        return address;
    }

    return null;
}

function replaceIPInConfig(inputConfig, ipOrAddress) {
    let isVmess = inputConfig.startsWith('vmess://');
    let isVless = inputConfig.startsWith('vless://');
    let addressStr = typeof ipOrAddress === 'string' ? ipOrAddress : ipOrAddress.toString();
    let result = '';

    if (isVmess) {
        let vmessConfig = JSON.parse(Base64.decode(inputConfig.replace('vmess://', '')));
        vmessConfig.add = addressStr;
        result = `vmess://${Base64.encode(JSON.stringify(vmessConfig))}\n\n`;
    } else if (isVless) {
        addressStr = addressStr.includes(':') && !addressStr.startsWith('[') ? `[${addressStr}]` : addressStr;
        const match = inputConfig.match(/^(vless:\/\/[^@]+)@([^:]+)(:.+)$/);
        const [_, start, domain, end] = match;
        result = `${start}@${addressStr}${end}\n\n`;
    }

    return result;
}

function displayResult(count) {
    const copyButton = document.getElementById('copyButton');
    const downloadButton = document.getElementById('downloadButton');

    if (generatedOutput) {
        showSuccess(`Successfully generated ${count} configs.`);
        copyButton.style.display = 'inline-block';
        downloadButton.style.display = 'inline-block';
    } else {
        showError('No configs were generated.');
        copyButton.style.display = 'none';
        downloadButton.style.display = 'none';
    }
}

async function loadIPRanges(service) {
    const url = `https://raw.githubusercontent.com/seramo/cdn-ip-ranges/main/${service}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error retrieving data: ${response.statusText}`);
        }

        const data = await response.json();
        const ipRanges = data.ipv4 || [];

        if (ipRanges.length === 0) {
            showWarning('No IP range found.');
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
        showError('An error occurred while loading IPs.');
    }
}

function copyToClipboard() {
    if (generatedOutput) {
        navigator.clipboard.writeText(generatedOutput.replace(/\n\n/g, '\n').trimEnd()).then(() => {
            showSuccess('Configs have been saved to clipboard.');
        }).catch(err => {
            console.error(err);
            showError('Copy error: ' + err);
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