class Interface {
    data = [];
    containter;

    constructor(containterId) {
        this.containter = document.getElementById(containterId);
    }

    init() {
        this.load(() => {
            for (var item of this.data) {
                console.log(item);
                this.add(item.id, item.keyword, item.target);
            }
        });
    }

    load(callback) {
        chrome.storage.sync.get('ninniaKeywordRedirects', (data) => {
            this.data = data.ninniaKeywordRedirects ? data.ninniaKeywordRedirects : [];
            callback();
        });
    }

    add(id = null, keyword = '', target = '') {
        if (id) {
            this.updateDataById(id, "element", this.newRow(id, keyword, target))
        } else {
            id = this.generateId();
            this.data.push({
                id,
                keyword,
                target,
                element: this.newRow(id, keyword, target)
            });
        }
    }

    remove(id) {
        this.data = this.data.filter((item) => {
            if (item.id === id) {
                item.element.remove();
                return false;
            }
            return true;
        });
        this.save();
    }

    updateDataById(id, type, value) {
        this.data.forEach((item) => {
            if (item.id === id) {
                item[type] = value;
            }
        });
        this.save();
    }

    save() {
        chrome.storage.sync.set({ ninniaKeywordRedirects: this.data }, () => {
            console.log("saved", this.data);
        });
    }

    clear() {
        chrome.storage.local.clear(() => {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }
        });
        chrome.storage.sync.clear();
    }

    generateId() {
        if (this.data.length === 0) return 0
        let highestId = this.data.reduce((max, obj) => obj.id > max ? obj.id : max, 0);
        return highestId + 1;
    }

    // HTML Interface

    newRow(id, keyword, target) {
        var row = document.createElement("div");
        row.classList.add("row");
        row.appendChild(this.newInput(id, "keyword", "Keyword", keyword));
        row.appendChild(this.newInput(id, "target", "URL", target));
        row.appendChild(this.newDeleteButton(id));
        this.containter.appendChild(row);
        return row;
    }

    newInput(id, type, placeholder, value) {
        var newInput = document.createElement("input");
        newInput.type = "text";
        newInput.value = value;
        newInput.placeholder = placeholder;
        newInput.setAttribute("autocomplete", "off");
        newInput.addEventListener('input', (event) => this.updateDataById(id, type, event.target.value))
        return newInput;
    }

    newDeleteButton(id) {
        var deleteButton = document.createElement("button");
        deleteButton.innerText = "delete";
        deleteButton.onclick = (event) => this.remove(id);
        return deleteButton;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const interface = new Interface("inputContainer");
    interface.init();

    document.getElementById("add").addEventListener("click", () => interface.add());
});
