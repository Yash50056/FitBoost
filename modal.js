document.addEventListener("DOMContentLoaded", function () {
  const modalTriggers = document.querySelectorAll(".modal-trigger");
  const modals = document.querySelectorAll(".modal");

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      const targetModalId = this.getAttribute("data-target");

      // Hide all modals
      modals.forEach((modal) => {
        modal.style.display = "none";
      });

      const targetModal = document.getElementById(targetModalId);

      if (targetModal) {
        targetModal.style.display = "block";
      }
    });
  });

  // Close modals when clicking outside of them
  window.addEventListener("click", function (event) {
    modals.forEach((modal) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });
});
