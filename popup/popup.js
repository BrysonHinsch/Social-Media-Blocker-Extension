
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
        limit_element.innerHTML = `Limit: ${Math.floor(item.limit/60000)} minutes`;
    }, (error) => {
        console.log("Failed to retrieve time limit")
    });

    const limit_used_element = document.getElementById("limit-used");
    let limit_used = browser.storage.local.get("limit_used")
    limit_used.then((item) => {
        limit_used_element.innerHTML = `Used: ${Math.floor(item.limit_used/60000)} minutes`;
    }, (error) => {
        console.log("Failed to retrieve time limit")
    });
}

function increase_limit_button() {
    const button = document.getElementById("add-5-minutes")
    button.addEventListener("click", () => {
        const limit = browser.storage.local.get("limit");
        limit.then((item) => {
            set_daily_limit(item.limit/60000 + 5)
            update_limit_text();
        })
    });
}

function decrease_limit_button() {
    const button = document.getElementById("subtract-5-minutes")
    button.addEventListener("click", () => {
        const limit = browser.storage.local.get("limit");
        limit.then((item) => {
            set_daily_limit(item.limit/60000 - 5)
            update_limit_text();
        })
    });
}

function popup_init() {
    increase_limit_button();
    decrease_limit_button();
    update_limit_text();
}

popup_init();