# V2Ray Config Modifier

A web-based tool to generate V2Ray configurations for multiple IP addresses or ranges, simplifying the process of creating configs for VLESS or VMESS protocols.

## Description

The **V2Ray Config Modifier** is an HTML and JavaScript-based application designed to help users generate multiple V2Ray configurations efficiently. Users can enter an existing VLESS or VMESS configuration, specify an IP address or range, or choose from predefined IP ranges of popular CDN providers like Cloudflare, Gcore, and Fastly. The tool then generates new configurations for each IP address in the specified range.

## Features

- **VLESS and VMESS Support**: Accepts both VLESS and VMESS configurations as input.
- **IP Range Input**: Users can enter custom IP addresses or ranges.
- **Predefined IP Ranges**: Easily select from existing IP ranges of Cloudflare, Gcore, or Fastly.
- **Bulk Config Generation**: Generates configurations for all specified IP addresses with a single click.
- **User-Friendly Interface**: Simple and intuitive design requiring no installation.
- **Export Options**: Save all generated configurations to a file.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari, etc.).
- An existing VLESS or VMESS configuration to use as a base.
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

- **Paste Configuration**: Copy and paste your existing VLESS or VMESS configuration.

### Step 2: Select IP Addresses

#### Option A: Enter Custom IP Range

- **IP Range**: Enter an IP range using CIDR notation (e.g., `192.168.1.0/24`).
- **Multiple IPs**: Provide a list of IP addresses, each on a new line.

#### Option B: Use Predefined IP Ranges

- **Cloudflare IP Ranges**: Select to use Cloudflare's IP addresses.
- **Gcore IP Ranges**: Choose Gcore's IP addresses.
- **Fastly IP Ranges**: Opt for Fastly's IP addresses.

### Step 3: Generate Configurations

- Click the **"Generate Configs"** button.
- The tool will process the base configuration and replace the IP address field with each IP from the specified ranges.
- The generated configurations will be available for copying or downloading.

### Step 4: Export Configurations

- **Copy**: Click the **"Copy"** button to copy all configurations to the clipboard.
- **Download**: Click the **"Download"** button to save all configurations to a file.

## Tutorial Video

Here's a quick tutorial on how to use the **V2Ray Config Modifier**:

[![V2Ray Config Modifier Tutorial](https://img.youtube.com/vi/J9g1kbdW8Oc/0.jpg)](https://youtu.be/J9g1kbdW8Oc)

## Note

You can combine custom IP ranges with predefined ranges.