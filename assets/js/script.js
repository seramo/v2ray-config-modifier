let generatedOutput = '';

window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadFromLocalStorage();
});

function toggleDarkMode() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    const btn = document.getElementById('darkModeToggle');
    if (btn) {
        btn.textContent = newTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    const btn = document.getElementById('darkModeToggle');
    if (btn) {
        btn.textContent = savedTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    }
}

function saveToLocalStorage() {
    localStorage.setItem('inputConfig', document.getElementById('inputConfig').value);
    localStorage.setItem('inputType', document.getElementById('inputType').value);
    localStorage.setItem('ipRange', document.getElementById('ipRange').value);
    localStorage.setItem('ipList', document.getElementById('ipList').value);
    localStorage.setItem('configList', document.getElementById('configList').value);
    localStorage.setItem('spoofIp', document.getElementById('spoofIp').value);
    localStorage.setItem('spoofPort', document.getElementById('spoofPort').value);
    localStorage.setItem('outputCount', document.getElementById('outputCount').value);
    localStorage.setItem('customPortOverride', document.getElementById('customPortOverride').value);
    localStorage.setItem('shuffleOutput', document.getElementById('shuffleOutput').checked);
}

function loadFromLocalStorage() {
    if (localStorage.getItem('inputConfig') !== null) {
        document.getElementById('inputConfig').value = localStorage.getItem('inputConfig');
    }
    if (localStorage.getItem('inputType') !== null) {
        document.getElementById('inputType').value = localStorage.getItem('inputType');
        toggleInputFields();
    }
    if (localStorage.getItem('ipRange') !== null) {
        document.getElementById('ipRange').value = localStorage.getItem('ipRange');
    }
    if (localStorage.getItem('ipList') !== null) {
        document.getElementById('ipList').value = localStorage.getItem('ipList');
    }
    if (localStorage.getItem('configList') !== null) {
        document.getElementById('configList').value = localStorage.getItem('configList');
    }
    if (localStorage.getItem('spoofIp') !== null) {
        document.getElementById('spoofIp').value = localStorage.getItem('spoofIp');
    }
    if (localStorage.getItem('spoofPort') !== null) {
        document.getElementById('spoofPort').value = localStorage.getItem('spoofPort');
    }
    if (localStorage.getItem('outputCount') !== null) {
        const val = localStorage.getItem('outputCount');
        document.getElementById('outputCount').value = val;
        document.getElementById('outputCountValue').textContent = val;
    }
    if (localStorage.getItem('customPortOverride') !== null) {
        document.getElementById('customPortOverride').value = localStorage.getItem('customPortOverride');
    }
    if (localStorage.getItem('shuffleOutput') !== null) {
        document.getElementById('shuffleOutput').checked = localStorage.getItem('shuffleOutput') === 'true';
    }
}

function clearAll() {
    localStorage.clear();
    initTheme();
    document.getElementById('inputConfig').value = '';
    document.getElementById('ipRange').value = '';
    document.getElementById('ipList').value = '';
    document.getElementById('configList').value = '';
    document.getElementById('spoofIp').value = '127.0.0.1';
    document.getElementById('spoofPort').value = '40443';
    document.getElementById('outputCount').value = '5000';
    document.getElementById('outputCountValue').textContent = '5000';
    document.getElementById('customPortOverride').value = '';
    document.getElementById('shuffleOutput').checked = false;
    document.getElementById('inputType').value = 'cidr';
    document.getElementById('inspectorBox').style.display = 'none';
    toggleInputFields();
    generatedOutput = '';
    document.getElementById('copyButton').style.display = 'none';
    document.getElementById('downloadButton').style.display = 'none';
    document.getElementById('previewContainer').style.display = 'none';
    showSuccess('All inputs and settings cleared.');
}

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

function detectConfigType(inputConfig) {
    if (inputConfig.startsWith('vmess://')) {
        return 'vmess';
    } else if (inputConfig.startsWith('vless://')) {
        return 'vless';
    } else if (inputConfig.startsWith('wireguard://')) {
        return 'wireguard';
    } else if (inputConfig.startsWith('trojan://')) {
        return 'trojan';
    } else if (inputConfig.startsWith('ss://')) {
        return 'shadowsocks';
    } else if (inputConfig.startsWith('hysteria://') || inputConfig.startsWith('hy2://') || inputConfig.startsWith('hysteria2://')) {
        return 'hysteria';
    } else if (inputConfig.startsWith('tuic://')) {
        return 'tuic';
    }
    return null;
}

function isValidConfigFormat(inputConfig) {
    return detectConfigType(inputConfig) !== null;
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
    saveToLocalStorage();
}

function finalizeOutputList(rawList) {
    let uniqueList = [...new Set(rawList)];
    if (document.getElementById('shuffleOutput') && document.getElementById('shuffleOutput').checked) {
        uniqueList = shuffleArray(uniqueList);
    }
    generatedOutput = uniqueList.join('\n\n') + '\n\n';
    displayResult(uniqueList.length);
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

    let rawList = [];
    let count = 0;

    for (const config of baseConfigs) {
        if (count >= outputCount) break;

        for (const ipRange of ipRanges) {
            const parsedCIDR = ipaddr.parseCIDR(ipRange.trim());
            const [ip] = parsedCIDR;
            let currentIp = ip;

            while (currentIp.match(parsedCIDR) && count < outputCount) {
                const modified = replaceIPAndPortInConfig(config.trim(), currentIp);
                if (modified) {
                    rawList.push(modified.trim());
                    count++;
                }
                currentIp = incrementIP(currentIp);
            }

            if (count >= outputCount) break;
        }
    }

    finalizeOutputList(rawList);
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

    let rawList = [];

    for (const config of baseConfigs) {
        for (const ip of validIpList) {
            const modified = replaceIPAndPortInConfig(config.trim(), ipaddr.parse(ip));
            if (modified) {
                rawList.push(modified.trim());
            }
        }
    }

    finalizeOutputList(rawList);
}

function modifyConfigsFromConfigsList(baseConfigs) {
    const configList = document.getElementById('configList').value.trim().split('\n').filter(config => config.trim() !== '');

    if (configList.length === 0) {
        showWarning('Please enter the configs list.');
        return;
    }

    let rawList = [];

    for (const baseConfig of baseConfigs) {
        for (const targetConfig of configList) {
            const address = extractAddressFromConfig(targetConfig.trim());
            if (address) {
                const modified = replaceIPAndPortInConfig(baseConfig.trim(), address);
                if (modified) {
                    rawList.push(modified.trim());
                }
            }
        }
    }

    finalizeOutputList(rawList);
}

function modifyConfigsFromSNISpoof(baseConfigs) {
    const spoofIp = document.getElementById('spoofIp').value.trim();
    const spoofPort = document.getElementById('spoofPort').value.trim();

    if (!spoofIp || !spoofPort) {
        showWarning('Please enter both Spoof IP and Port.');
        return;
    }

    let rawList = [];

    for (const config of baseConfigs) {
        const modified = replaceIPAndPortInConfig(config.trim(), spoofIp, spoofPort);
        if (modified) {
            rawList.push(modified.trim());
        }
    }

    finalizeOutputList(rawList);
}

function extractAddressFromConfig(config) {
    let configType = detectConfigType(config);

    if (configType === 'vmess') {
        try {
            const base64Str = config.substring(8);
            const decodedStr = Base64.decode(base64Str);
            const vmessConfig = JSON.parse(decodedStr);
            return vmessConfig.add;
        } catch (e) {
            return null;
        }
    } else if (configType === 'vless') {
        const regex = /vless:\/\/([^@]+)@([^:]+):(\d+)(\?[^#]*)?(#.*)?/;
        const match = config.match(regex);
        return match ? match[2] : null;
    } else if (configType === 'wireguard') {
        const regex = /wireguard:\/\/[^@]+@([^:]+):.+/;
        const match = config.match(regex);
        return match ? match[1] : null;
    } else if (configType === 'trojan') {
        const regex = /trojan:\/\/[^@]+@([^:]+):.+/;
        const match = config.match(regex);
        return match ? match[1] : null;
    } else if (configType === 'shadowsocks') {
        const regex = /ss:\/\/(?:[^@]+@)?([^:]+):(\d+)/;
        const match = config.match(regex);
        return match ? match[1] : null;
    } else if (configType === 'hysteria') {
        const regex = /(?:hysteria2?|hy2|hysteria):\/\/(?:[^@]+@)?([^:]+):(\d+)/;
        const match = config.match(regex);
        return match ? match[1] : null;
    } else if (configType === 'tuic') {
        const regex = /tuic:\/\/(?:[^@]+@)?([^:]+):(\d+)/;
        const match = config.match(regex);
        return match ? match[1] : null;
    }

    return null;
}

function extractPortFromConfig(config) {
    let type = detectConfigType(config);
    if (type === 'vmess') {
        try {
            const vmessConfig = JSON.parse(Base64.decode(config.substring(8)));
            return vmessConfig.port;
        } catch(e) { return null; }
    } else {
        const match = config.match(/:(\d+)(?:\?|#|$)/);
        return match ? parseInt(match[1]) : null;
    }
}

function extractNameFromConfig(config) {
    const hashIndex = config.indexOf('#');
    if (hashIndex !== -1) {
        return decodeURIComponent(config.substring(hashIndex + 1));
    }
    return null;
}

function replaceIPAndPortInConfig(inputConfig, ipOrAddress, newPort = null) {
    let configType = detectConfigType(inputConfig);
    let addressStr = typeof ipOrAddress === 'string' ? ipOrAddress : ipOrAddress.toString();
    let result = '';

    if (configType === 'vmess') {
        try {
            let vmessConfig = JSON.parse(Base64.decode(inputConfig.replace('vmess://', '')));
            vmessConfig.add = addressStr;
            if (newPort) vmessConfig.port = parseInt(newPort);
            result = `vmess://${Base64.encode(JSON.stringify(vmessConfig))}\n\n`;
        } catch (e) {
            return null;
        }
    } else if (configType === 'vless') {
        addressStr = addressStr.includes(':') && !addressStr.startsWith('[') ? `[${addressStr}]` : addressStr;
        const match = inputConfig.match(/^(vless:\/\/[^@]+)@([^:]+):(\d+)(.*)$/);
        if (match) {
            const [_, start, domain, port, end] = match;
            result = `${start}@${addressStr}:${newPort || port}${end}\n\n`;
        }
    } else if (configType === 'wireguard') {
        const regex = /^(wireguard:\/\/[^@]+@)[^:]+:(\d+)(.*)$/;
        result = inputConfig.replace(regex, (m, p1, p2, p3) => `${p1}${addressStr}:${newPort || p2}${p3}\n\n`);
    } else if (configType === 'trojan') {
        const regex = /^(trojan:\/\/[^@]+@)[^:]+:(\d+)(.*)$/;
        result = inputConfig.replace(regex, (m, p1, p2, p3) => `${p1}${addressStr}:${newPort || p2}${p3}\n\n`);
    } else if (configType === 'shadowsocks') {
        addressStr = addressStr.includes(':') && !addressStr.startsWith('[') ? `[${addressStr}]` : addressStr;
        const regex = /^(ss:\/\/(?:[^@]+@)?)[^:]+:(\d+)(.*)$/;
        result = inputConfig.replace(regex, (m, p1, p2, p3) => `${p1}${addressStr}:${newPort || p2}${p3}\n\n`);
    } else if (configType === 'hysteria') {
        addressStr = addressStr.includes(':') && !addressStr.startsWith('[') ? `[${addressStr}]` : addressStr;
        const regex = /^((?:hysteria2?|hy2|hysteria):\/\/(?:[^@]+@)?)[^:]+:(\d+)(.*)$/;
        result = inputConfig.replace(regex, (m, p1, p2, p3) => `${p1}${addressStr}:${newPort || p2}${p3}\n\n`);
    } else if (configType === 'tuic') {
        addressStr = addressStr.includes(':') && !addressStr.startsWith('[') ? `[${addressStr}]` : addressStr;
        const regex = /^(tuic:\/\/(?:[^@]+@)?)[^:]+:(\d+)(.*)$/;
        result = inputConfig.replace(regex, (m, p1, p2, p3) => `${p1}${addressStr}:${newPort || p2}${p3}\n\n`);
    }

    return result;
}

function convertToClash(config) {
    let type = detectConfigType(config);
    let address = extractAddressFromConfig(config);
    let port = extractPortFromConfig(config);
    let name = extractNameFromConfig(config) || `proxy_${Math.random().toString(36).substring(7)}`;
    
    if (!address || !port) return null;

    let clashType = type === 'shadowsocks' ? 'ss' : (type === 'wireguard' ? 'wireguard' : type);
    return `  - name: "${name}"\n    type: ${clashType}\n    server: ${address}\n    port: ${port}`;
}

function convertToSingBox(config) {
    let type = detectConfigType(config);
    let address = extractAddressFromConfig(config);
    let port = extractPortFromConfig(config);
    let tag = extractNameFromConfig(config) || `proxy_${Math.random().toString(36).substring(7)}`;

    if (!address || !port) return null;

    return `    {\n      "tag": "${tag}",\n      "type": "${type}",\n      "server": "${address}",\n      "server_port": ${port}\n    }`;
}

function getFormattedOutputText() {
    const format = document.getElementById('exportFormat').value;
    const lines = generatedOutput.split('\n').filter(l => l.trim() !== '');
    const uniqueLines = [...new Set(lines)];

    if (format === 'plain') {
        return uniqueLines.join('\n');
    } else if (format === 'clash') {
        let clashOutput = "proxies:\n";
        for (const line of uniqueLines) {
            let clashProxy = convertToClash(line);
            if (clashProxy) clashOutput += clashProxy + "\n";
        }
        return clashOutput;
    } else if (format === 'singbox') {
        let outbounds = [];
        for (const line of uniqueLines) {
            let sb = convertToSingBox(line);
            if (sb) outbounds.push(sb);
        }
        return "{\n  \"outbounds\": [\n" + outbounds.join(',\n') + "\n  ]\n}";
    }
    return uniqueLines.join('\n');
}

function updatePreviewFormat() {
    const previewArea = document.getElementById('previewArea');
    if (generatedOutput) {
        previewArea.value = getFormattedOutputText();
    }
}

function inspectConfig() {
    const rawInput = document.getElementById('inputConfig').value.trim();
    const inspectorBox = document.getElementById('inspectorBox');
    const inspectorContent = document.getElementById('inspectorContent');

    if (!rawInput) {
        showWarning('Please enter a config to inspect.');
        inspectorBox.style.display = 'none';
        return;
    }

    const firstConfig = rawInput.split('\n')[0].trim();
    if (!isValidConfigFormat(firstConfig)) {
        showError('Invalid base config format.');
        inspectorBox.style.display = 'none';
        return;
    }

    const type = detectConfigType(firstConfig);
    const address = extractAddressFromConfig(firstConfig);
    const port = extractPortFromConfig(firstConfig);
    const name = extractNameFromConfig(firstConfig) || 'N/A';

    let details = `
        <strong>Protocol:</strong> ${type.toUpperCase()}<br>
        <strong>Address (Server):</strong> ${address || 'N/A'}<br>
        <strong>Port:</strong> ${port || 'N/A'}<br>
        <strong>Remark / Name:</strong> ${name}<br>
    `;

    if (type === 'vmess') {
        try {
            const vmessConfig = JSON.parse(Base64.decode(firstConfig.substring(8)));
            details += `<strong>UUID:</strong> ${vmessConfig.id || 'N/A'}<br>`;
            details += `<strong>AlterId:</strong> ${vmessConfig.aid || '0'}<br>`;
            details += `<strong>Network:</strong> ${vmessConfig.net || 'tcp'}<br>`;
            details += `<strong>Security:</strong> ${vmessConfig.scy || 'auto'}<br>`;
        } catch(e) {}
    } else if (type === 'vless') {
        const uuidMatch = firstConfig.match(/vless:\/\/([^@]+)@/);
        if (uuidMatch) details += `<strong>UUID:</strong> ${uuidMatch[1]}<br>`;
    }

    inspectorContent.innerHTML = details;
    inspectorBox.style.display = 'block';
}

function displayResult(count) {
    const copyButton = document.getElementById('copyButton');
    const downloadButton = document.getElementById('downloadButton');
    const previewContainer = document.getElementById('previewContainer');
    const previewArea = document.getElementById('previewArea');
    const previewCount = document.getElementById('previewCount');
    const qrSelectIndex = document.getElementById('qrSelectIndex');

    if (generatedOutput) {
        showSuccess(`Successfully generated ${count} unique configs.`);
        copyButton.style.display = 'inline-block';
        downloadButton.style.display = 'inline-block';
        previewContainer.style.display = 'block';
        previewArea.value = getFormattedOutputText();
        previewCount.textContent = count;
        qrSelectIndex.max = count;
    } else {
        showError('No configs were generated.');
        copyButton.style.display = 'none';
        downloadButton.style.display = 'none';
        previewContainer.style.display = 'none';
    }
}

function showQRCodeForSelected() {
    const idx = parseInt(document.getElementById('qrSelectIndex').value) - 1;
    const lines = generatedOutput.split('\n').filter(l => l.trim() !== '');
    if (idx < 0 || idx >= lines.length) {
        showWarning('Invalid config index.');
        return;
    }
    const configLine = lines[idx];

    try {
        const qr = qrcode(0, 'L');
        qr.addData(configLine);
        qr.make();
        const svgTag = qr.createSvgTag({cellSize: 4, margin: 4});

        const modalQrCode = document.getElementById('modalQrCode');
        const modalConfigText = document.getElementById('modalConfigText');
        modalQrCode.innerHTML = svgTag;
        modalConfigText.textContent = configLine;

        const qrModal = new bootstrap.Modal(document.getElementById('qrModal'));
        qrModal.show();
    } catch (e) {
        console.error(e);
        showError('Error generating QR code (config might be too long).');
    }
}

function copySubscriptionLink() {
    if (!generatedOutput) return;
    const plainText = generatedOutput.split('\n').filter(l => l.trim() !== '').join('\n');
    const base64Sub = Base64.encode(plainText);
    navigator.clipboard.writeText(base64Sub).then(() => {
        showSuccess('Base64 Subscription Link copied to clipboard.');
    }).catch(err => {
        showError('Failed to copy subscription link: ' + err);
    });
}

function showSubQRCode() {
    if (!generatedOutput) return;
    const plainText = generatedOutput.split('\n').filter(l => l.trim() !== '').join('\n');
    const base64Sub = Base64.encode(plainText);

    try {
        const qr = qrcode(0, 'L');
        qr.addData(base64Sub);
        qr.make();
        const svgTag = qr.createSvgTag({cellSize: 3, margin: 4});

        const modalQrCode = document.getElementById('modalQrCode');
        const modalConfigText = document.getElementById('modalConfigText');
        modalQrCode.innerHTML = svgTag;
        modalConfigText.textContent = "Subscription Link (Base64)";

        const qrModal = new bootstrap.Modal(document.getElementById('qrModal'));
        qrModal.show();
    } catch (e) {
        console.error(e);
        showError('Subscription link is too large for QR code.');
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
            showSummary('No IP range found.');
            return;
        }

        if (service !== 'gcore') {
            const shuffledIPRanges = shuffleArray(ipRanges).slice(0, 4);
            document.getElementById('ipRange').value = shuffledIPRanges.join('\n');
        } else {
            document.getElementById('ipRange').value = ipRanges.join('\n');
        }
        saveToLocalStorage();
    } catch (error) {
        console.error(error);
        showError('An error occurred while loading IPs.');
    }
}

function copyToClipboard() {
    if (generatedOutput) {
        const textToCopy = getFormattedOutputText();
        navigator.clipboard.writeText(textToCopy).then(() => {
            showSuccess('Configs have been saved to clipboard.');
        }).catch(err => {
            console.error(err);
            showError('Copy error: ' + err);
        });
    }
}

function downloadOutput() {
    if (generatedOutput) {
        const textToDownload = getFormattedOutputText();
        const format = document.getElementById('exportFormat').value;
        const ext = format === 'clash' ? 'yaml' : (format === 'singbox' ? 'json' : 'txt');
        const blob = new Blob([textToDownload], { type: 'text/plain' });
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        const fileName = `modified_configs_${date}_${time}.${ext}`;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
    }
}
