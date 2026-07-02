
// Main check timestamps
let last_time_checked = Date.now();
let last_day = new Date().toString();

// popup + button timestamps
let ignore = false;
let popup_visible = false;
let limit_extension = 0; // Will always go off the first time

function update_limit_used() {
    // Update last_time_checked
    // It still needs to be updated even if the tab isnt focused
    // to prevent a large amount of time being added at once later
    const current_time = Date.now();
    const time_since = current_time - last_time_checked;
    last_time_checked = current_time;
    last_day = new Date().toString();
    
    // Check if the tab is focused
    // Prevents double counting and only counts one page at a time
    if (!document.hasFocus()) {return;}
    
    // Check if it's a new day
    // If the day changes the counter needs to be reset
    if (last_day != new Date().toString()) {
        browser.storage.local.set({"limit_used" : 0})
        return;
    }
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

    if (ignore === true) return;
    
    if (Date.now() - limit_extension < 300000) return;

    if (limit_used.limit_used >= limit.limit && !popup_visible) {
        append_popup_window();
        popup_visible = true;
    }
}

function continue_button_handler() {
    limit_extension = Date.now(); // Sets 5 minute timer
    const element = document.getElementById("limit-popup");
    element.remove();
    popup_visible = false;
}

function ignore_button_handler() {
    ignore = true; // ignores requests to append the popup window
    const element = document.getElementById("limit-popup");
    element.remove();
    popup_visible = false;
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
    button_1.addEventListener("click", continue_button_handler);
    content.appendChild(button_1);

    const button_2 = document.createElement("button");
    button_2.textContent = "Ignore for this tab";
    button_2.addEventListener("click", ignore_button_handler);
    content.appendChild(button_2);

    popup.appendChild(content);

    document.body.prepend(popup);
}

initialize_storage();
setInterval(update_limit_used, 30000);
setInterval(check_over_limit, 60000);