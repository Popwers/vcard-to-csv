// Read the vCard file
const vcardData = Bun.file(Bun.argv[2]);
const vCardText = await vcardData.text();

// Split the vCard text into individual vCards
const vCards = vCardText.split('BEGIN:VCARD');

// Initialize an array to store CSV rows with headers
const csvRows = [];

// Add the CSV header row
const csvHeader = [
	'First Name',
	'Middle Name',
	'Last Name',
	'Title',
	'Suffix',
	'Nickname',
	'Given Yomi',
	'Surname Yomi',
	'E-mail Address',
	'E-mail 2 Address',
	'E-mail 3 Address',
	'Home Phone',
	'Home Phone 2',
	'Business Phone',
	'Business Phone 2',
	'Mobile Phone',
	'Car Phone',
	'Other Phone',
	'Primary Phone',
	'Pager',
	'Business Fax',
	'Home Fax',
	'Other Fax',
	'Company Main Phone',
	'Callback',
	'Radio Phone',
	'Telex',
	'TTY/TDD Phone',
	'IMAddress',
	'Job Title',
	'Department',
	'Company',
	'Office Location',
	"Manager's Name",
	"Assistant's Name",
	"Assistant's Phone",
	'Company Yomi',
	'Business Street',
	'Business City',
	'Business State',
	'Business Postal Code',
	'Business Country/Region',
	'Home Street',
	'Home City',
	'Home State',
	'Home Postal Code',
	'Home Country/Region',
	'Other Street',
	'Other City',
	'Other State',
	'Other Postal Code',
	'Other Country/Region',
	'Personal Web Page',
	'Spouse',
	'Schools',
	'Hobby',
	'Location',
	'Web Page',
	'Birthday',
	'Anniversary',
	'Notes',
];

// Iterate through each vCard
for (const vCard of vCards) {
	if (vCard.trim() === '') {
		continue; // Skip empty vCards
	}

	const csvRow = Array(csvHeader.length).fill(''); // Initialize with empty values
	const sanitizedVCard = vCard.replace(/\r+/g, ''); // Remove carriage returns
	const lines = sanitizedVCard.split('\n');

	let currentPropertyName = '';

	// Iterate through each line in the vCard
	for (const line of lines) {
		if (line.startsWith(' ') || line.startsWith('\t')) {
			// This line is a continuation of the previous property
			if (currentPropertyName) {
				// Add the line to the existing property
				csvRow[csvHeader.indexOf(currentPropertyName)] += '\n' + line.trim();
			}
		} else {
			// This line starts a new property
			const [property, value] = line.split(':');
			const propertyParts = property.split(';');
			const propertyName = propertyParts[0];

			// Update the current property name
			currentPropertyName = propertyName;

			switch (propertyName) {
				case 'FN':
					const names = value.split(' ');
					csvRow[0] = names[0] || ''; // First Name
					csvRow[2] = names.slice(1).join(' ') || ''; // Last Name
					break;
				case 'N':
					const nameParts = value.split(';');
					csvRow[0] = nameParts[1] || ''; // First Name
					csvRow[1] = nameParts[2] || ''; // Middle Name
					csvRow[2] = nameParts[0] || ''; // Last Name
					break;
				case 'TITLE':
					csvRow[3] = value; // Title
					break;
				case 'SUFFIX':
					csvRow[4] = value; // Suffix
					break;
				case 'NICKNAME':
					csvRow[5] = value; // Nickname
					break;
				case 'GIVEN YOMI':
					csvRow[6] = value; // Given Yomi
					break;
				case 'SURNAME YOMI':
					csvRow[7] = value; // Surname Yomi
					break;
				case 'EMAIL':
					if (!csvRow[8]) {
						csvRow[8] = value; // E-mail Address
					} else if (!csvRow[9]) {
						csvRow[9] = value; // E-mail 2 Address
					} else if (!csvRow[10]) {
						csvRow[10] = value; // E-mail 3 Address
					}
					break;
				case 'TEL':
					const telType1 = propertyParts[1];
					if (telType1) {
						const telType = telType1.replace('TYPE=', '');
						switch (telType) {
							// Handle different phone types (e.g., HOME, CELL, WORK)
							case 'HOME,VOICE,pref':
							case 'HOME,VOICE':
								csvRow[11] = value; // Home Phone
								break;
							case 'HOME,VOICE':
								csvRow[12] = value; // Home Phone 2
								break;
							case 'CELL,VOICE,pref':
								csvRow[13] = value; // Business Phone
								break;
							case 'CELL,VOICE':
								csvRow[14] = value; // Business Phone 2
								break;
							case 'OTHER,VOICE':
								csvRow[15] = value; // Mobile Phone
								break;
							case 'pref':
								csvRow[16] = value; // Car Phone
								break;
							case 'PAGER':
								csvRow[17] = value; // Other Phone
								break;
							case 'WORK,FAX':
								csvRow[18] = value; // Primary Phone
								break;
							case 'HOME,FAX':
								csvRow[19] = value; // Pager
								break;
							case 'OTHER,FAX':
								csvRow[20] = value; // Business Fax
								break;
							case 'CALLBACK':
								csvRow[21] = value; // Home Fax
								break;
							case 'RADIO':
								csvRow[22] = value; // Company Main Phone
								break;
							case 'TELEX':
								csvRow[23] = value; // Callback
								break;
							case 'TTY-TDD':
								csvRow[24] = value; // Radio Phone
								break;
							case 'CELL':
								csvRow[25] = value; // Mobile Phone
								break;
							case 'OTHER':
								csvRow[26] = value; // Other Phone
								break;
						}
					}
					break;
				case 'IMAddress':
					csvRow[27] = value; // IMAddress
					break;
				case 'TITLE':
					csvRow[28] = value; // Job Title
					break;
				case 'ORG':
					csvRow[29] = value; // Department
					break;
				case 'ROLE':
					csvRow[30] = value; // Company
					break;
				case 'ORG':
					csvRow[31] = value; // Office Location
					break;
				case 'MANAGER':
					csvRow[32] = value; // Manager's Name
					break;
				case 'ASSISTANT':
					csvRow[33] = value; // Assistant's Name
					break;
				case 'TEL':
					const telType2 = propertyParts[1];
					if (telType2) {
						const telType3 = telType1.replace('TYPE=', '');
						switch (telType3) {
							case 'CELL':
								csvRow[34] = value; // Assistant's Phone
								break;
						}
					}
					break;
				case 'X-ABSC':
					csvRow[35] = value; // Company Yomi
					break;
				case 'ADR':
					const adrType = propertyParts[1];
					if (adrType) {
						switch (adrType) {
							case 'HOME':
								const homeAddressParts = value.split(';');
								csvRow[36] = homeAddressParts[2] || ''; // Home Street
								csvRow[37] = homeAddressParts[3] || ''; // Home City
								csvRow[38] = homeAddressParts[4] || ''; // Home State
								csvRow[39] = homeAddressParts[5] || ''; // Home Postal Code
								csvRow[40] = homeAddressParts[6] || ''; // Home Country/Region
								break;
							case 'WORK':
								const workAddressParts = value.split(';');
								csvRow[41] = workAddressParts[2] || ''; // Business Street
								csvRow[42] = workAddressParts[3] || ''; // Business City
								csvRow[43] = workAddressParts[4] || ''; // Business State
								csvRow[44] = workAddressParts[5] || ''; // Business Postal Code
								csvRow[45] = workAddressParts[6] || ''; // Business Country/Region
								break;
						}
					}
					break;
				case 'URL':
					csvRow[46] = value; // Personal Web Page
					break;
				case 'X-SPOUSE':
					csvRow[47] = value; // Spouse
					break;
				case 'X-SCHOOLS':
					csvRow[48] = value; // Schools
					break;
				case 'X-HOBBY':
					csvRow[49] = value; // Hobby
					break;
				case 'X-LOCATION':
					csvRow[50] = value; // Location
					break;
				case 'Web Page':
					csvRow[51] = value; // Web Page
					break;
				case 'BDAY':
					csvRow[52] = value; // Birthday
					break;
				case 'ANNIVERSARY':
					csvRow[53] = value; // Anniversary
					break;
				case 'NOTE':
					csvRow[54] = value; // Notes
					break;
				// Add more cases for other properties you want to extract
			}
		}
	}

	csvRow.forEach((value, index) => {
		if (index !== 54) {
			csvRow[index] = csvRow[index].replace(/,/g, '');
			csvRow[index] = csvRow[index].replace(/"/g, '');
			csvRow[index] = csvRow[index].replace(/'/g, '');
			csvRow[index] = csvRow[index].replace(/`/g, '');
			csvRow[index] = csvRow[index].replace(';\r', '');
			csvRow[index] = csvRow[index].replace('\r', '');
			csvRow[index] = csvRow[index].replace(';', '');
		}
	});

	console.log(csvRow);

	// Push the extracted data as a CSV row
	csvRows.push(csvRow);
}

// Combine CSV rows into a CSV string
const csvString = csvHeader.join(',') + '\n' + csvRows.map(row => row.join(',')).join('\n');

// Write the CSV string to a file
const csvFile = Bun.file('contacts.csv');
await Bun.write(csvFile, csvString);
