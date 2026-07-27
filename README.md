# V2Ray Config Modifier

[فارسی (Persian)](README.fa.md)

> **Acknowledgements & Credits:** This project is an extended fork of the original [V2Ray Config Modifier](https://github.com/seramo/v2ray-config-modifier) created by **[seramo](https://github.com/seramo)**. Huge thanks to seramo for building this fantastic foundation and core tool!

A web-based tool to generate and modify configurations for multiple IP addresses or ranges, supporting VMESS, VLESS, WireGuard, Trojan, Shadowsocks, Hysteria (v1/v2), and TUIC protocols.

## 📑 Table of Contents
- [Description](#description)
- [Features](#features)
- [Getting Started](#getting-started)
- [Accessing the Application Online](#accessing-the-application-online)
- [Usage](#usage)
- [Tutorial Video](#tutorial-video)
- [Acknowledgements & Credits](#acknowledgements--credits)
- [Contribution](#contribution)

The **V2Ray Config Modifier** is an HTML and JavaScript-based application designed to help users generate multiple configurations efficiently. Users can input existing configurations, specify IP addresses or ranges, or choose from predefined IP ranges of popular CDN providers like Cloudflare, Gcore, and Fastly. The tool generates new configurations for each IP address or range with advanced export, inspection, and formatting options.

## Features

- **Extended Protocol Support**: Accepts VMESS, VLESS, WireGuard, Trojan, Shadowsocks, Hysteria (v1/v2), and TUIC configurations as input.
- **Config Inspector**: Inspect and analyze base configuration details instantly (Protocol, Server IP, Port, UUID, Remark, etc.).
- **IP Range Input**: Enter custom IP addresses or ranges in CIDR format.
- **Predefined IP Ranges**: Easily select from existing IP ranges of Cloudflare, Gcore, or Fastly.
- **Config List Support**: Paste a list of existing configurations and generate new ones based on a base config.
- **Automatic Deduplication**: Eliminates duplicate IP addresses and configurations automatically.
- **Advanced Export Formats**: Export or copy generated configs as Plain Text, Clash (YAML), or Sing-box (JSON).
- **Base64 Subscription Link**: Generate and copy Base64 subscription links or view subscription QR codes.
- **QR Code Generator**: Generate QR codes for individual configurations or subscription links.
- **Dark Mode**: Toggle between Light and Dark themes.
- **LocalStorage Persistence**: Automatically saves your inputs and settings across browser sessions.
- **Custom Port Override & Shuffle**: Optionally override ports and randomly shuffle output configurations.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari, etc.).
- An existing proxy configuration to use as a base.
- Basic understanding of configurations and IP addressing.

### Installation

1. **Clone or Download the Repository**

   - Clone the repository with Git:

     ```bash
     git clone https://github.com/ChiakoRh/v2ray-config-modifier.git
     ```

   - Or [download the ZIP file](https://github.com/ChiakoRh/v2ray-config-modifier/archive/refs/heads/main.zip) and extract it.

2. **Open the Application**

   - Navigate to the extracted folder.
   - Open `index.html` in your preferred web browser.

## Accessing the Application Online

You can use the **V2Ray Config Modifier** directly from your web browser without the need to install any software. Simply visit the following URL to access the application:

[https://chiakorh.github.io/v2ray-config-modifier/](https://chiakorh.github.io/v2ray-config-modifier/)

This web-based version is fully functional and allows you to generate and download configurations.

## Usage

### Step 1: Input Base Configuration

- **Paste Configuration**: Copy and paste your existing VMESS, VLESS, WireGuard, Trojan, Shadowsocks, Hysteria, or TUIC configuration.
- **Inspect Config**: Click "Inspect Config" to view parsed parameters.

### Step 2: Select IP Addresses or Configs

#### Option A: Enter Custom IP Range

- **IP Range**: Enter an IP range using CIDR notation (e.g., `192.168.1.0/24`).
- **Multiple IPs**: Provide a list of IP addresses, each on a new line.

#### Option B: Use Predefined IP Ranges

- **Cloudflare IP Ranges**: Select to use Cloudflare's IP addresses.
- **Gcore IP Ranges**: Choose Gcore's IP addresses.
- **Fastly IP Ranges**: Opt for Fastly's IP addresses.

#### Option C: Enter a List of Configs

- **Config List**: Paste a list of existing configurations. The tool will extract the IP address from each configuration and use them to generate new configurations based on the provided base config.

#### Note

You can combine custom IP ranges with predefined ranges for more flexibility.

### Step 3: Generate Configurations

- Click the **"Generate Configs"** button.
- The tool processes the base configuration and replaces the IP address with each IP from the specified ranges or config list, removing duplicates and optionally shuffling the output.

### Step 4: Export & Share Configurations

- **Export Format**: Choose between Plain Text, Clash (YAML), or Sing-box (JSON).
- **Copy**: Click the **"Copy"** button to copy all configurations to the clipboard.
- **Download**: Click the **"Download"** button to save all configurations to a file.
- **Subscription Link**: Copy Base64 subscription links or view QR codes.

## Tutorial Video

Here's a quick tutorial on how to use the **V2Ray Config Modifier**:

[![V2Ray Config Modifier Tutorial](https://img.youtube.com/vi/J9g1kbdW8Oc/0.jpg)](https://youtu.be/J9g1kbdW8Oc)

## Acknowledgements & Credits

This project is an extended fork of the original [V2Ray Config Modifier](https://github.com/seramo/v2ray-config-modifier) created by **[seramo](https://github.com/seramo)**. Huge thanks to seramo for building this fantastic foundation and core tool!

## Contribution

Contributions and updates are welcome. Please submit changes via a Pull Request.
