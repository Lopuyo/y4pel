console.log('Welcome to Y4Pel');
const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
});
// Close mobile menu after clicking a navigation link

const navLinks = menu.querySelectorAll("a");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        menu.classList.remove("active");
    });
});

// Initialize EmailJS
emailjs.init({
    publicKey: "mPtG-juUfLF4XwRfW"
});

const form = document.getElementById("join-form");

form.addEventListener("submit", function (e) {

    e.preventDefault();
    
    const button = form.querySelector("button");

    button.disabled = true;
    button.innerHTML = "Submitting...";

    emailjs.send("service_2lnoh7n", "template_zky8pls", {
        name: form.name.value,
        email: form.email.value,
        country: form.country.value,
        institution: form.institution.value,
        interest: form.interest.value,
        motivation: form.motivation.value
    })

    .then(function () {

        return emailjs.send("service_2lnoh7n", "template_bv3b9fr", {
            name: form.name.value,
            email: form.email.value,
            country: form.country.value,
            institution: form.institution.value,
            interest: form.interest.value,
            motivation: form.motivation.value
        });

    })

    .then(function () {

        alert("Thank you for joining Youth for Pelindaba (Y4Pel)! A confirmation email has been sent to your inbox.");

        form.reset();

    })

    .catch(function (error) {

        console.error(error);

        alert("Submission failed. Please try again.");

    })

    .finally(function () {

        button.disabled = false;
        button.innerHTML = "Join Y4Pel";

    });

});

document.addEventListener("DOMContentLoaded", () => {

    const object = document.getElementById("africa-svg");

    const members = {

        KE:3,
        SS:2,
        ZW:1,
        ZM:1,
        UG:1,
        NG:1,
        DZ:1,
        BJ:1

    };

    const names = {

        KE:"Kenya",
        SS:"South Sudan",
        ZW:"Zimbabwe",
        ZM:"Zambia",
        UG:"Uganda",
        NG:"Nigeria",
        DZ:"Algeria",
        BJ:"Benin"

    };

    const tooltip = document.createElement("div");

    tooltip.id="map-tooltip";

    document.body.appendChild(tooltip);

    object.addEventListener("load",()=>{

        const svgDoc = object.contentDocument;

        Object.keys(members).forEach(code=>{

            const country = svgDoc.getElementById(code);

            if(!country) return;

            country.style.fill="#0B6E4F";

            country.style.cursor="pointer";

            country.style.transition="0.3s";

            country.addEventListener("mouseenter",(e)=>{

                country.style.fill="#F2C94C";

                tooltip.style.opacity=1;

                tooltip.innerHTML=
                    "🌍 <strong>"+names[code]+"</strong><br>" +
                    "Members: "+members[code];

            });

            country.addEventListener("mousemove",(e)=>{

                tooltip.style.left=e.pageX+18+"px";

                tooltip.style.top=e.pageY-20+"px";

            });

            country.addEventListener("mouseleave",()=>{

                country.style.fill="#0B6E4F";

                tooltip.style.opacity=0;

            });

        });

    });

});
