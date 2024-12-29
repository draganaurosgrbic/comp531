const userProfile = {
    displayName: 'test name',
    emailAddress: 'asd@gmail.com',
    phoneNumber: '123-123-1234',
    zipCode: '77030',
    password: 'password',
    passwordConfirmation: 'password'
}

const profileTable = {
    'displayName': '',
    'emailAddress': 'The email entered is not valid (e.g. asd@gmail.com, has to have a "@" sign and letters around)!',
    'phoneNumber': 'Phone number has to be in ddd-ddd-dddd format (e.g. 123-123-1234)!',
    'zipCode': 'Zip code has to be in ddddd format (e.g. 77030)!',
    'password': 'The password can not be empty or contain white spaces around!',
    'passwordConfirmation': 'The confirmation does not match with the password entered above!'
}

let disableInput = false;

const camelCaseToWords = text => {
    const temp = text.replace(/([A-Z])/g, " $1");
    return temp[0].toUpperCase() + temp.substr(1);
}

const clearInputFields = () => {
    for (const field in profileTable) {
        document.getElementById(`${field}Input`).value = '';
    }
}

const clearErrorFields = () => {
    for (const field in profileTable) {
        document.getElementById(`${field}Error`).innerHTML = '';
    }
}

const fillInForm = () => {
    for (const field in profileTable) {
        document.getElementById(field).innerHTML = field.startsWith('password') ? userProfile[field].replace(/./g, '*') : userProfile[field];
    }
}

const showInfoBox = message => {
    const infoMessage = document.getElementById('infoMessage');
    infoMessage.innerHTML = message;

    const infoBox = document.getElementById('infoBox');
    infoBox.style.display = '';

    disableInput = true;
}

const hideInfoBox = () => {
    const infoBox = document.getElementById('infoBox');
    infoBox.style.display = 'none';

    disableInput = false;
}

const validateForm = () => {
    clearErrorFields();

    let infoMessage = '';
    let errors = false;

    for (const field in profileTable) {
        const fieldInput = document.getElementById(`${field}Input`);
        if (field === 'password') {
            if (fieldInput.value !== fieldInput.value.trim()) {
                document.getElementById(`${field}Error`).innerHTML = profileTable[field];
                errors = true;
            } else if (fieldInput.value !== document.getElementById('passwordConfirmationInput').value) {
                document.getElementById(`${field}ConfirmationError`).innerHTML = profileTable[`${field}Confirmation`];
                errors = true;
            }
        }
        if (fieldInput.value.trim() !== '' && field !== 'passwordConfirmation') {
            if (fieldInput.validity.typeMismatch || fieldInput.validity.patternMismatch) {
                document.getElementById(`${field}Error`).innerHTML = profileTable[field];
                errors = true;
            }
            else {
                const oldValue = field.startsWith('password') ? userProfile[field].replace(/./g, '*') : userProfile[field];
                const newValue = field.startsWith('password') ? fieldInput.value.trim().replace(/./g, '*') : fieldInput.value.trim();
                infoMessage += `<li><b>${camelCaseToWords(field)}</b> from <i>${oldValue}</i> to <i>${newValue}</i></li>`
            }
        }
    }

    if (errors || infoMessage === '') {
        return;
    }

    showInfoBox(`Fields that are being updated:<ol>${infoMessage}</ol>`);
}

const submitForm = () => {
    for (const field in profileTable) {
        const inputValue = document.getElementById(`${field}Input`).value.trim();
        if (inputValue) {
            userProfile[field] = inputValue;
            fillInForm();
        }
    }

    clearInputFields();
    hideInfoBox();
}

const setup = () => {
    fillInForm();
    hideInfoBox();

    window.addEventListener('keypress', e => {
        if (disableInput) {
            e.preventDefault();
        }
    });
}