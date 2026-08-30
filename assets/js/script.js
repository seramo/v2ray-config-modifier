let generatedOutput = '';

const PATTNG_ADDRESS = '188.114.97.6';
const PATTNG_PORTS_443 = ['443', '2053', '2083', '2087', '2096', '8443'];
const PATTNG_PORTS_8080 = ['80', '8080', '8880', '2052', '2082', '2086', '2095'];
const PATTNG_TRANSPORTS = ['ws', 'xhttp', 'websocket', 'httpupgrade', 'grpc'];
const PATTNG_FM_443 = decodeURIComponent('%7B%22tcp%22%3A%20%5B%7B%22type%22%3A%20%22fragment%22%2C%20%22settings%22%3A%20%7B%22packets%22%3A%20%22tlshello%22%2C%20%22lengths%22%3A%20%5B%225%22%2C%20%2294%22%2C%20%221%22%5D%2C%20%22delays%22%3A%20%5B%220%22%5D%2C%20%22maxSplit%22%3A%20%220%22%7D%7D%2C%7B%22type%22%3A%20%22fragment%22%2C%20%22settings%22%3A%20%7B%22packets%22%3A%20%221-1%22%2C%20%22lengths%22%3A%20%5B%22109%22%2C%20%221%22%5D%2C%20%22delays%22%3A%20%5B%221%22%5D%2C%20%22maxSplit%22%3A%20%22355%22%7D%7D%5D%7D');
const PATTNG_CS_443 = decodeURIComponent('TLS_AES_256_GCM_SHA384%3ATLS_CHACHA20_POLY1305_SHA256%3ATLS_AES_128_GCM_SHA256%3ATLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384%3ATLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384%3ATLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256%3ATLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256%3ATLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256%3ATLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256%3ATLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA%3ATLS_ECDHE_RSA_WITH_AES_256_CBC_SHA%3ATLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256%3ATLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256');
const PATTNG_FM_8080 = decodeURIComponent('%7B%22tcp%22%3A%20%5B%7B%22type%22%3A%20%22fragment%22%2C%20%22settings%22%3A%20%7B%22packets%22%3A%20%221-1%22%2C%20%22lengths%22%3A%20%5B%221%22%5D%2C%20%22delays%22%3A%20%5B%224%22%5D%2C%20%22maxSplit%22%3A%20%22522%22%7D%7D%5D%7D');

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

    messageBox.style.display = 'block';
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
    } else if (inputType === 'pattng') {
        modifyConfigsForPattNG(baseConfigs);
    }
}

function modifyConfigsForPattNG(baseConfigs) {
    const configs = [...new Set(baseConfigs.map(config => transformPattNGConfig(config.trim())).filter(Boolean))];

    generatedOutput = configs.length ? `${configs.join('\n\n')}\n\n` : '';
    displayResult(configs.length);
}

function transformPattNGConfig(config) {
    const configType = detectConfigType(config);
    if (configType !== 'vless' && configType !== 'trojan') return '';

    let node;
    try {
        node = new URL(config);
    } catch (error) {
        return '';
    }

    const security = getPattNGParam(node, 'security').toLowerCase();
    const transport = getPattNGParam(node, 'type').toLowerCase();
    const host = getPattNGParam(node, 'host');
    const tls = security === 'tls';

    if (!['', 'tls', 'none'].includes(security)) return '';
    if (!PATTNG_TRANSPORTS.includes(transport) || !host.trim()) return '';
    if (tls && !PATTNG_PORTS_443.includes(node.port)) return '';
    if (!tls && !PATTNG_PORTS_8080.includes(node.port)) return '';

    node.hostname = PATTNG_ADDRESS;
    node.port = tls ? '443' : '8080';

    for (const key of [...node.searchParams.keys()]) {
        if (['allowinsecure', 'allow_insecure', 'insecure'].includes(key.toLowerCase())) {
            node.searchParams.delete(key);
        }
    }

    if (tls) {
        setPattNGParam(node, 'fp', 'unsafe');
        setPattNGParam(node, 'fm', PATTNG_FM_443);
        setPattNGParam(node, 'cs', PATTNG_CS_443);
        setPattNGParam(node, 'sni', host);
    } else {
        setPattNGParam(node, 'fm', PATTNG_FM_8080);
        for (const key of ['sni', 'alpn', 'fp', 'cs']) {
            deletePattNGParam(node, key);
        }
    }

    return node.toString().replace(/\+/g, '%20');
}

function getPattNGParam(node, key) {
    for (const [name, value] of node.searchParams) {
        if (name.toLowerCase() === key) return value;
    }
    return '';
}

function setPattNGParam(node, key, value) {
    deletePattNGParam(node, key);
    node.searchParams.set(key, value);
}

function deletePattNGParam(node, key) {
    for (const name of [...node.searchParams.keys()]) {
        if (name.toLowerCase() === key) node.searchParams.delete(name);
    }
}

function modifyConfigsFromCIDR(baseConfigs) {
    const ipRanges = document.getElementById('ipRange').value.trim().split('\n').filter(range => range.trim() !== '');
    const outputCount = Math.floor(Number(document.getElementById('outputCount').value));

    if (!Number.isFinite(outputCount) || outputCount < 1) {
        showWarning('Please enter a valid number of outputs.');
        return;
    }

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
    const formActions = document.getElementById('formActions');
    const copyButton = document.getElementById('copyButton');
    const downloadButton = document.getElementById('downloadButton');

    if (generatedOutput) {
        showSuccess(`Successfully generated ${count} configs.`);
        formActions.classList.add('has-output');
        copyButton.style.display = 'inline-block';
        downloadButton.style.display = 'inline-block';
    } else {
        showError('No configs were generated.');
        formActions.classList.remove('has-output');
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

function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        document.getElementById('themeSunIcon').classList.toggle('d-none', nextTheme !== 'light');
        document.getElementById('themeMoonIcon').classList.toggle('d-none', nextTheme !== 'dark');
        themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
        themeToggle.title = `Switch to ${nextTheme} mode`;
    }

    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#141c23' : '#f5f8fa';
}

function toggleTheme() {
    const theme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    setTheme(theme);
}

setTheme(localStorage.getItem('theme') || 'dark');

function updateBaseConfigCount() {
    const inputConfig = document.getElementById('inputConfig');
    const baseConfigCount = document.getElementById('baseConfigCount');

    if (! inputConfig || ! baseConfigCount) {
        return;
    }

    const count = inputConfig.value.split(/\n+/).map(line => line.trim()).filter(Boolean).length;
    baseConfigCount.textContent = `${count} config${count === 1 ? '' : 's'}`;
}

const inputConfig = document.getElementById('inputConfig');
if (inputConfig) {
    inputConfig.addEventListener('input', updateBaseConfigCount);
    updateBaseConfigCount();
}