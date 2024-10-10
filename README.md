# V2Ray Config Modifier

A web-based tool to generate V2Ray configurations for multiple IP addresses or ranges, supporting VMESS, VLESS, WireGuard, and Trojan protocols.

## Description

The **V2Ray Config Modifier** is an HTML and JavaScript-based application designed to help users generate multiple V2Ray configurations efficiently. Users can input existing VMESS, VLESS, WireGuard, or Trojan configurations, specify IP addresses or ranges, or choose from predefined IP ranges of popular CDN providers like Cloudflare, Gcore, and Fastly. The tool generates new configurations for each IP address or range.

## Features

- **VMESS, VLESS, WireGuard, and Trojan Support**: Accepts VMESS, VLESS, WireGuard, and Trojan configurations as input.
- **IP Range Input**: Users can enter custom IP addresses or ranges in CIDR format.
- **Predefined IP Ranges**: Easily select from existing IP ranges of Cloudflare, Gcore, or Fastly.
- **Config List Support**: Paste a list of VMESS, VLESS, WireGuard, or Trojan configurations and generate new ones based on a base config.
- **Bulk Config Generation**: Generates configurations for all specified IP addresses or configurations in one click.
- **User-Friendly Interface**: Simple design with no installation needed.
- **Export Options**: Save generated configurations to a file or copy to the clipboard.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari, etc.).
- An existing VMESS, VLESS, WireGuard, or Trojan configuration to use as a base.
- Basic understanding of V2Ray configurations and IP addressing.

### Installation

1. **Clone or Download the Repository**

   - Clone the repository with Git:

     ```bash
     git clone https://github.com/seramo/v2ray-config-modifier.git
     ```

   - Or [download the ZIP file](https://github.com/seramo/v2ray-config-modifier/archive/refs/heads/main.zip) and extract it.

2. **Open the Application**

   - Navigate to the extracted folder.
   - Open `index.html` in your preferred web browser.

## Accessing the Application Online

You can use the **V2Ray Config Modifier** directly from your web browser without the need to install any software. Simply visit the following URL to access the application:

[https://seramo.github.io/v2ray-config-modifier/](https://seramo.github.io/v2ray-config-modifier/)

This web-based version is fully functional and allows you to generate and download V2Ray configurations.

## Usage

### Step 1: Input Base Configuration

- **Paste Configuration**: Copy and paste your existing VMESS, VLESS, WireGuard, or Trojan configuration.

### Step 2: Select IP Addresses or Configs

#### Option A: Enter Custom IP Range

- **IP Range**: Enter an IP range using CIDR notation (e.g., `192.168.1.0/24`).
- **Multiple IPs**: Provide a list of IP addresses, each on a new line.

#### Option B: Use Predefined IP Ranges

- **Cloudflare IP Ranges**: Select to use Cloudflare's IP addresses.
- **Gcore IP Ranges**: Choose Gcore's IP addresses.
- **Fastly IP Ranges**: Opt for Fastly's IP addresses.

#### Option C: Enter a List of Configs

- **Config List**: Paste a list of existing VMESS, VLESS, WireGuard, or Trojan configurations. The tool will extract the IP address from each configuration and use them to generate new configurations based on the provided base config.

#### Note

You can combine custom IP ranges with predefined ranges for more flexibility.

### Step 3: Generate Configurations

- Click the **"Generate Configs"** button.
- The tool processes the base configuration and replaces the IP address with each IP from the specified ranges or config list.
- The generated configurations will be available for copying or downloading.

### Step 4: Export Configurations

- **Copy**: Click the **"Copy"** button to copy all configurations to the clipboard.
- **Download**: Click the **"Download"** button to save all configurations to a file.

## Tutorial Video

Here's a quick tutorial on how to use the **V2Ray Config Modifier**:

[![V2Ray Config Modifier Tutorial](https://img.youtube.com/vi/J9g1kbdW8Oc/0.jpg)](https://youtu.be/J9g1kbdW8Oc)

## Contribution

Contributions and updates are welcome. Please submit changes via a Pull Request.
