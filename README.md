# vCard to CSV Converter

This JavaScript script converts vCard files into CSV format, making it easy to extract and manipulate contact information from vCard files. The script can be used for various purposes, such as importing contacts into different applications or performing data analysis.

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Customization](#customization)
- [License](#license)

## Features

- Converts vCard files into CSV format.
- Extracts various contact details, such as names, emails, phone numbers, addresses, and more.
- Cleans and formats extracted data for CSV compatibility.
- Customizable to extract additional vCard properties as needed.

## Usage

1. Ensure you have [Bun.js](https://bun.sh/) installed on your machine or install it with the following command:

   ```shell
   curl -fsSL https://bun.sh/install | bash
   ```

2. Clone this repository to your local machine:

   ```shell
   git clone https://github.com/yourusername/vcard-to-csv-converter.git
    ```
3. Navigate to the project directory:
    ```shell
    cd vcard-to-csv-converter
    ```

4. Run the script with the vCard file you want to convert:
    ```shell
    bun vcard_to_csv.js path/to/your-vcard-file.vcf
    ```

The script will process the vCard file and create a CSV file named contacts.csv in the same directory as the script. The CSV file will contain the extracted contact information.

## Customization

The script is designed to extract common vCard properties such as names, emails, and phone numbers. If you need to extract additional properties or customize the extraction process, you can edit the script and add more cases for the desired properties in the switch statement. Be sure to adjust the CSV header and data accordingly.

## License

This script is licensed under the MIT License. See the LICENSE file for details.
