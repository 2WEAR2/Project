// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Находим все элементы с классом copy-text
    const copyElements = document.querySelectorAll('.copy-text');
    
    // Добавляем обработчик для каждого элемента
    copyElements.forEach(element => {
        element.addEventListener('click', function() {
            copyText(this);
        });
    });
});

function copyText(element) {
    const originalText = element.textContent;
    
    navigator.clipboard.writeText(originalText)
        .then(() => {
            showCopiedFeedback(element, originalText);
        })
        .catch(err => {
            // Fallback для старых браузеров
            fallbackCopyText(originalText);
            showCopiedFeedback(element, originalText);
        });
}

function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}

function showCopiedFeedback(element, originalText) {
    element.textContent = 'Скопировано!';
    element.classList.add('copied');
    
    setTimeout(() => {
        element.textContent = originalText;
        element.classList.remove('copied');
    }, 1200);
}