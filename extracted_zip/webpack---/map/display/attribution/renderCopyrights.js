export default function renderCopyrights(data) {
    const [copyright, owner, termsConditionsLink] = data.split(/\n/).filter(line => line.length);
    return `<div id="copyrightMessage">
        <h4>General Copyrights:</h4>
        <p>${copyright}</p>
        <p>${owner}</p>
        <p>${termsConditionsLink}<p>
        </div>`;
}
