 // Функции для работы с модальными окнами
    function openModal(modalId) {
      document.getElementById(modalId).style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    function closeModal(modalId) {
      document.getElementById(modalId).style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    function openContactForm(service) {
      // Закрываем все модальные окна
      closeAllModals();
      
      // Прокручиваем к форме контактов
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      
      // Заполняем поле сообщения
      document.getElementById('message').value = 'Интересует услуга: ' + service;
    }

    function closeAllModals() {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
        modal.style.display = 'none';
      });
      document.body.style.overflow = 'auto';
    }

    // Закрытие модального окна при клике вне его
    window.onclick = function(event) {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
        if (event.target === modal) {
          closeModal(modal.id);
        }
      });
    }

    // Закрытие модального окна при нажатии ESC
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        closeAllModals();
      }
    });