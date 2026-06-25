
function set_daily_limit(limit) {
    if (isNaN(limit)) {
        return false;
    }
    const daily_limit = {"limit" : limit*60000};
    browser.storage.local.set(daily_limit);
    return true;
}

function update_limit_text() {

    const limit_element = document.getElementById("limit");
    let limit = browser.storage.local.get("limit")
    limit.then((item) => {
        limit_element.innerHTML = `Daily Limit: ${Math.floor(item.limit/60000)} minutes`;
    }, (error) => {
        console.log("Failed to retrieve time limit")
    });

    const limit_used_element = document.getElementById("limit-used");
    let limit_used = browser.storage.local.get("limit_used")
    limit_used.then((item) => {
        limit_used_element.innerHTML = `Time Used: ${Math.floor(item.limit_used/60000)} minutes`;
    }, (error) => {
        console.log("Failed to retrieve time limit")
    });
}

function limit_button_click_handler() {
    const button = document.getElementById("set-limit")
    button.addEventListener("click", () => {
        const limit = Number(document.getElementById("limit-input").value);
        set_daily_limit(limit);
        update_limit_text();
    });
}

function popup_init() {
    limit_button_click_handler();
    update_limit_text();
}

popup_init();