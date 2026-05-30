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
    const sniSpoofFields = document.getElementById('sniSpoofFields');

    cidrFields.style.display = 'none';
    listFields.style.display = 'none';
    configListFields.style.display = 'none';
    sniSpoofFields.style.display = 'none';

    if (inputType === 'cidr') {
        cidrFields.style.display = 'block';
    } else if (inputType === 'list') {
        listFields.style.display = 'block';
    } else if (inputType === 'configList') {
        configListFields.style.display = 'block';
    } else if (inputType === 'sniSpoof') {
        sniSpoofFields.style.display = 'block';
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
    if (inputConfig.startsWith('vmess://') || inputConfig.startsWith('vless://') ||
        inputConfig.startsWith('wireguard://') || inputConfig.startsWith('trojan://')) {
        return true;
    }
    return false;
}

function detectConfigType(inputConfig) {
    if (inputConfig.startsWith('vmess://')) {
        return 'vmess';
    } else if (inputConfig.startsWith('vless://')) {
        return 'vless';
    } else if (inputConfig.startsWith('wireguard://')) {
        return 'wireguard';
    } else if (inputConfig.startsWith('trojan://')) {
        return 'trojan';
    }
    return null;
}

function generateConfigs() {
    const inputType = document.getElementById('inputType').value;
    const rawInput = document.getElementById('inputConfig').value.trim();

    if (!rawInput) {
        showWarning('Please enter the config.');
        return;
    }

    const baseConfigs = rawInput.split('\n').filter(c => isValidConfigFormat(c.trim()));

    if (baseConfigs.length === 0) {
        showWarning('No valid base configs found.');
        return;
    }

    if (inputType === 'cidr') {
        modifyConfigsFromCIDR(baseConfigs);
    } else if (inputType === 'list') {
        modifyConfigsFromList(baseConfigs);
    } else if (inputType === 'configList') {
        modifyConfigsFromConfigsList(baseConfigs);
    } else if (inputType === 'sniSpoof') {
        modifyConfigsFromSNISpoof(baseConfigs);
    }
}

function modifyConfigsFromCIDR(baseConfigs) {
    const ipRanges = document.getElementById('ipRange').value.trim().split('\n').filter(range => range.trim() !== '');
    const outputCount = parseInt(document.getElementById('outputCount').value);

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

    for (const config of baseConfigs) {
        if (count >= outputCount) break;

        for (const ipRange of ipRanges) {
            const [ip, range] = ipaddr.parseCIDR(ipRange.trim());
            let currentIp = ip;

            while (currentIp.match(ipaddr.parseCIDR(ipRange.trim())) && count < outputCount) {
                generatedOutput += replaceIPAndPortInConfig(config.trim(), currentIp);
                count++;
                currentIp = incrementIP(currentIp);
            }

            if (count >= outputCount) break;
        }
    }

    displayResult(count);
}

function modifyConfigsFromList(baseConfigs) {
    const rawText = document.getElementById('ipList').value.trim();

    if (rawText.length === 0) {
        showWarning('Please enter the IP list.');
        return;
    }

    const ipv4Matches = rawText.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [];
    const ipv6Matches = rawText.match(/(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:)*:[a-fA-F0-9]{1,4}(?::[a-fA-F0-9]{1,4})*/g) || [];
    const allMatches = [...ipv4Matches, ...ipv6Matches];
    const validIpList = [...new Set(allMatches)].filter(ip => ipaddr.isValid(ip));

    if (validIpList.length === 0) {
        showWarning('No valid IPs found in the input.');
        return;
    }

    generatedOutput = '';
    let count = 0;

    for (const config of baseConfigs) {
        for (const ip of validIpList) {
            generatedOutput += replaceIPAndPortInConfig(config.trim(), ipaddr.parse(ip));
            count++;
        }
    }

    displayResult(count);
}

function modifyConfigsFromConfigsList(baseConfigs) {
    const configList = document.getElementById('configList').value.trim().split('\n').filter(config => config.trim() !== '');

    if (configList.length === 0) {
        showWarning('Please enter the configs list.');
        return;
    }

    generatedOutput = '';
    let count = 0;

    for (const baseConfig of baseConfigs) {
        for (const targetConfig of configList) {
            const address = extractAddressFromConfig(targetConfig.trim());
            if (address) {
                generatedOutput += replaceIPAndPortInConfig(baseConfig.trim(), address);
                count++;
            }
        }
    }

    displayResult(count);
}

function modifyConfigsFromSNISpoof(baseConfigs) {
    const spoofIp = document.getElementById('spoofIp').value.trim();
    const spoofPort = document.getElementById('spoofPort').value.trim();

    if (!spoofIp || !spoofPort) {
        showWarning('Please enter both Spoof IP and Port.');
        return;
    }

    generatedOutput = '';
    let count = 0;

    for (const config of baseConfigs) {
        generatedOutput += replaceIPAndPortInConfig(config.trim(), spoofIp, spoofPort);
        count++;
    }

    displayResult(count);
}

function extractAddressFromConfig(config) {
    let configType = detectConfigType(config);

    if (configType === 'vmess') {
        const base64Str = config.substring(8);
        const decodedStr = Base64.decode(base64Str);
        const vmessConfig = JSON.parse(decodedStr);
        return vmessConfig.add;
    } else if (configType === 'vless') {
        const regex = /vless:\/\/([^@]+)@([^:]+):(\d+)(\?[^#]*)?(#.*)?/;
        const match = config.match(regex);
        const address = match[2];
        return address;
    } else if (configType === 'wireguard') {
        const regex = /wireguard:\/\/[^@]+@([^:]+):.+/;
        const match = config.match(regex);
        return match[1];
    } else if (configType === 'trojan') {
        const regex = /trojan:\/\/[^@]+@([^:]+):.+/;
        const match = config.match(regex);
        return match[1];
    }

    return null;
}

function replaceIPAndPortInConfig(inputConfig, ipOrAddress, newPort = null) {
    let configType = detectConfigType(inputConfig);
    let addressStr = typeof ipOrAddress === 'string' ? ipOrAddress : ipOrAddress.toString();
    let result = '';

    if (configType === 'vmess') {
        let vmessConfig = JSON.parse(Base64.decode(inputConfig.replace('vmess://', '')));
        vmessConfig.add = addressStr;
        if (newPort) vmessConfig.port = parseInt(newPort);
        result = `vmess://${Base64.encode(JSON.stringify(vmessConfig))}\n\n`;
    } else if (configType === 'vless') {
        addressStr = addressStr.includes(':') && !addressStr.startsWith('[') ? `[${addressStr}]` : addressStr;
        const match = inputConfig.match(/^(vless:\/\/[^@]+)@([^:]+):(\d+)(.*)$/);
        const [_, start, domain, port, end] = match;
        result = `${start}@${addressStr}:${newPort || port}${end}\n\n`;
    } else if (configType === 'wireguard') {
        const regex = /^(wireguard:\/\/[^@]+@)[^:]+:(\d+)(.*)$/;
        result = inputConfig.replace(regex, (m, p1, p2, p3) => `${p1}${addressStr}:${newPort || p2}${p3}\n\n`);
    } else if (configType === 'trojan') {
        const regex = /^(trojan:\/\/[^@]+@)[^:]+:(\d+)(.*)$/;
        result = inputConfig.replace(regex, (m, p1, p2, p3) => `${p1}${addressStr}:${newPort || p2}${p3}\n\n`);
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