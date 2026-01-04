function convertToCSV(objArray) {
    alert("HI");
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    // Header Row
    let str = 'Job Title,URL,Date Applied\r\n';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        // Escape commas in titles to avoid breaking CSV columns
        const title = `"${array[i].title.replace(/"/g, '""')}"`;
        const url = `"${array[i].url}"`;
        const date = `"${new Date(array[i].timestamp).toLocaleString()}"`;
        
        line = `${title},${url},${date}`;
        str += line + '\r\n';
    }
    return str;
}

function downloadCSV(data) {
    const csvString = convertToCSV(data);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `job_applications_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}