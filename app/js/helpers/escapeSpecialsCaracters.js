export function escapeSpecialsCaracters(str) {
    return str
           .replace(/&/g, '&amp;')
           .replace(/>/g, '&gt;')
           .replace(/</g, '&lt;')
           .replace(/"/g, '&quot;');
}