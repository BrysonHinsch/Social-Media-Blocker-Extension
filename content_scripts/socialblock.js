
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
        append_popup_window();
    }
}

// Yuck I wish I could use react or smth else this is hideous
function append_popup_window() {
    const popup = document.createElement("div");
    popup.id = "limit-popup";

    const content = document.createElement("div");
    content.id = "popup-content"

    const text = document.createElement("p");
    text.textContent = "You've reached your daily limit";
    content.appendChild(text);

    const button_1 = document.createElement("button");
    button_1.textContent = "5 more minutes";
    content.appendChild(button_1);

    const button_2 = document.createElement("button");
    button_2.textContent = "Ignore for the session";
    content.appendChild(button_2);

    popup.appendChild(content);

    document.body.prepend(popup);
}

initialize_storage();
setInterval(update_limit_used, 60000);
setInterval(check_over_limit, 1000);