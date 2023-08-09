const { ipcRenderer } = require('electron');

let options = {
    silent: false,
    printBackground: true,
    color: false,
    margin: {
        marginType: 'printableArea'
    },
    landscape: false,
    pagesPerSheet: 1,
    collate: false,
    copies: 1,
    header: 'Header of the Page',
    footer: 'Footer of the Page'
}

function printAccess() {
    let option = {
        "ask" : "123",
        "anser" : "321"
    }
    ipcRenderer.send('print-google',option);}

// 監聽主進程回傳的結果
ipcRenderer.on('print-result', (event, result) => {
    if (result.success) {
        console.log('Print initiated successfully.');
    } else {
        console.log('Failed to initiate print:', result.failureReason);
    }
});
