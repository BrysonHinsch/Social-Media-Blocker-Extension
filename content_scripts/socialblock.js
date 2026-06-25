
let last_time_checked = Date.now();

function delete_body() {
    document.body.remove();
}

function update_limit_used() {
    const current_time = Date.now();
    const time_since = current_time - last_time_checked;
    last_time_checked = current_time;
    let limit_used = browser.storage.local.get("limit_used")
    limit_used.then((item) => {
        const new_limit_used = {"limit_used" : item.limit_used + time_since};
        browser.storage.local.set(new_limit_used);
    }, (error) => {
        console.log("Failed to retrieve time limit")
    }); 
}

function initialize_storage() {
    let limit = browser.storage.local.get("limit");
    limit.then((item) => {
        if (item.limit == undefined) {
            browser.storage.local.set({"limit" : 3600000});
        }
    }, (error) => {
        console.log("Failed to retrieve limit");
    })
    let limit_used = browser.storage.local.get("limit_used");
    limit_used.then((item) => {
        if (item.limit_used == undefined) {
            browser.storage.local.set({"limit_used" : 0});
        }
    }, (error) => {
        console.log("Failed to retrieve limit_used");
    })
}

async function check_over_limit() {
    let limit = await browser.storage.local.get("limit");
    let limit_used = await browser.storage.local.get("limit_used");

    if (limit_used.limit_used >= limit.limit) {
        delete_body();
    }
}

initialize_storage();
setInterval(update_limit_used, 60000);
setInterval(check_over_limit, 60000);