console.log('Welcome to Y4Pel');
const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
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
