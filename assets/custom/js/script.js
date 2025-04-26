const urlParams = new URLSearchParams(window.location.search);
async function checkForDuplicateLead(email, phone) {
    const webhookUrl = 'https://leadsense.bitrix24.in/rest/31/j87gms00216fmp2o/crm.lead.list.json';
    // Prepare query parameters
    const queryParams = new URLSearchParams();
    if (email) {
        queryParams.append('filter[EMAIL]', email);
    }
    if (phone) {
        queryParams.append('filter[PHONE]', phone);
    }
    queryParams.append('select[]', 'ID'); // Add ID to the select array
    const response = await fetch(`${webhookUrl}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result.result.length > 0 ? result.result[0].ID : null;
}

async function addLeadToBitrix24(name, email, phone, course, soursevalue) {
    const existingLeadId = await checkForDuplicateLead(email, phone);
    // console.log(existingLeadId);
    if (existingLeadId) {
        alert('errrr')
        window.location.href = './registered.php'

        return;
    } else {
        const campaignName = urlParams.get('utm_campaign');
        const webhookUrl = 'https://leadsense.bitrix24.in/rest/31/j87gms00216fmp2o/crm.lead.add.json';
        const data = {
            fields: {
                TITLE: 'https://iop.liba.edu/',
                NAME: name,
                EMAIL: [{ VALUE: email, VALUE_TYPE: 'WORK' }],
                PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
                SOURCE_ID: soursevalue,
                UF_CRM_1637687988896: course, // Adding source as source description
                UF_CRM_1727439091764: campaignName,
            }
        };
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.error) {
                alert('Error: ' + result.error_description);

            } else {


                $('.preloader').addClass('preloader-deactivate');
                window.location.href = './end.php'



            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Error: ' + error);
        }
    }
}

async function callApi(name, email, phone, course) {


    const soursevalue = "UC_M6FZWA";
    const campaignName = urlParams.get('utm_campaign');
    // Data to send to the API
    const data = {
        action: 'insertData',
        name: name,
        email: email,
        mobile: phone,
        course: course,
        source: soursevalue,
        campaign_name: campaignName,
    };
    try {
        // Make the POST request to the API
        const response = await fetch('https://iop.liba.edu/api/leadadd.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            window.location.href = 'http://localhost/registered.php/'


            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        addLeadToBitrix24(name, email, phone, course, soursevalue)
        // console.log('Success:', result);
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {

    }
}

function validateForm() {

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const course = document.getElementById("course").value.trim();
    const query=document.getElementById("query").value.trim();
    const nameErr = document.getElementById("name-error");
    const phoneErr = document.getElementById("phone-error");
    const emailErr = document.getElementById("email-error");
    const courseErr = document.getElementById("course-error");
   const queryErr= document.getElementById("query-error");


    let isValid = true;

    if (name === "") {
        nameErr.textContent = "Name is Required!";
        nameErr.style.display = "block";
        isValid = false;
    }

    if (phone === "" || !/^\d{10}$/.test(phone)) {
        phoneErr.textContent = "Enter a valid 10-digit Phone Number!";
        phoneErr.style.display = "block";
        isValid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email === "" || !emailPattern.test(email)) {
        emailErr.textContent = "Please Enter a Valid Email Address!.";
        emailErr.style.display = "block";
        isValid = false;
    }
     
    if ( query=== "") {
        queryErr.textContent = "Your Query is Required!";
        queryErr.style.display = "block";
        isValid = false;
    }

    if (course === "") {
        courseErr.textContent = "Please Select Course!";
        courseErr.style.display = "block";
        isValid = false;
    }

    if (isValid) {
        $('.p').removeClass('preloader-deactivate');
        addLeadToBitrix24(name, email, phone, '691', 'WEB')
        return true;
    } else {
        return false;
    }
}
function formValidate() {
    console.log("dfvsdv")
    const names= document.getElementById("names").value.trim();
    const phones = document.getElementById("phones").value.trim();
    const emails = document.getElementById("emails").value.trim();
    const coursess = document.getElementById("coursess").value.trim();
    const nameErr = document.getElementById("name-errors");
    const phoneErr = document.getElementById("phone-errors");
    const emailErr = document.getElementById("email-errors");
    const coursesErr = document.getElementById("course-errors");



    let isValid = true;

    if (names === "") {
        nameErr.textContent = "Name is Required!";
        nameErr.style.display = "block";
        isValid = false;
    }

    if (phones === "" || !/^\d{10}$/.test(phones)) {
        phoneErr.textContent = "Enter a valid 10-digit phone number.";
        phoneErr.style.display = "block";
        isValid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emails === "" || !emailPattern.test(emails)) {
        emailErr.textContent = "Please enter a valid email address.";
        emailErr.style.display = "block";
        isValid = false;
    }
    if (coursess === "") {
        coursesErr.textContent = "Your Query is Required";
        coursesErr.style.display = "block";
        isValid = false;
    }

    if (isValid) {
        $('.preloader').removeClass('preloader-deactivate');
        addLeadToBitrix24(names, emails, phones,coursess, '2529', 'WEB')
        return true;
    } else {
        return false;
    }
}



document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("scrollUp").style.display = "none";
});

