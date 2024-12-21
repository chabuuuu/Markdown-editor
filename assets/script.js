// Xử lý các nút định dạng văn bản
document.getElementById('boldBtn').addEventListener('click', () => {
    wrapText('**', '**');
});

document.getElementById('headerBtn').addEventListener('click', () => {
    wrapText('## ', '');
});

document.getElementById('colorBtn').addEventListener('click', () => {
    // Hiển thị color picker khi người dùng nhấn nút
    document.getElementById('colorPicker').click();
});

document.getElementById('colorPicker').addEventListener('input', (e) => {
    const color = e.target.value; // Lấy màu người dùng đã chọn
    wrapText(`<span style="color:${color};">`, '</span>');
});

document.getElementById('imageUpload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const randomFileName = `image-${Date.now()}-${file.name}`;
        const imagePath = `assets/images/${randomFileName}`;
        uploadImage(file, randomFileName);
        insertImage(imagePath);
    }
});

document.getElementById('generateBtn').addEventListener('click', () => {
    const editorContent = document.getElementById('editor').value;
    const output = document.getElementById('mdOutput');
    output.textContent = editorContent;
});

function wrapText(start, end) {
    const editor = document.getElementById('editor');
    const selection = editor.selectionStart;
    const selectedText = editor.value.substring(selection, editor.selectionEnd);
    const newText = `${start}${selectedText}${end}`;
    editor.setRangeText(newText);
}

function insertImage(imagePath) {
    const editor = document.getElementById('editor');
    const imageMarkdown = `![alt text](${imagePath})`;
    editor.value += imageMarkdown;
}

function uploadImage(file, randomFileName) {
    const formData = new FormData();
    formData.append('image', file, randomFileName);

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Ảnh đã được upload:', data);
    })
    .catch(error => {
        console.error('Có lỗi khi upload ảnh:', error);
    });
}

const editor = document.getElementById('editor');
const mdPreview = document.getElementById('mdPreview');

function renderMarkdown() {
    const markdownText = editor.value;
    const htmlContent = marked.parse(markdownText);
    mdPreview.innerHTML = htmlContent;
}

editor.addEventListener('input', renderMarkdown);

document.getElementById('generateBtn').addEventListener('click', () => {
    const markdownText = editor.value;
    const blob = new Blob([markdownText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'file.md';
    a.click();
});
