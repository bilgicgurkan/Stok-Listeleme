const titleItem = document.querySelector("#title-item");
const categoryItem = document.querySelector("#category-item");
const priceItem = document.querySelector("#price-item");
const descItem = document.querySelector("#desc-item");
const saveBtn = document.querySelector("#saveBtn");
const listArea = document.querySelector(".list-area");
const text = document.querySelector("#inputArea");

// alert fonksiyonu. buradan alıp gerekli yerlerde değer girerek kullanıyoruz.
function alertDisplay(text) {
    const alertArea = document.querySelector(".alert-area");
    alertArea.innerHTML = text;
    alertArea.classList.add("alert-area-display");
    setTimeout(function () {
        alertArea.innerHTML = "";
        alertArea.classList.remove("alert-area-display");
    }, 2000);
};

// sayfayı yenileme fonksiyonu
function reloadWindows() {
    setTimeout(function () {
        window.location.reload()
    }, 100);
};

// random sayı üreten function
function randomId() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};

// EKRANDA LİSTELEMEYİ ÇALIŞTIRAN FUNCTION
saveBtn.addEventListener("click", addItemList);
// en başta boş bir dizi oluşturduk bu dizi üzerinden ilerleyeceğiz.
let cardArray = [];

// bu fonksiyon önce localStorage'a gidip bakıyor eğer kayıtlı veri varsa onları alıyor ve yukarıda boş olarak tanımladığımız cardArray dizimize atıyor. Böylelikle önceden kayıt yapılan veriler gelmiş oluyor. Gelen verileri de aşağıda sayfa yüklendiği anda ekrana basmış oluyoruz.
function getList() {
    if (localStorage.getItem("list") !== null && localStorage.getItem("list") !== undefined) {
        cardArray = JSON.parse(localStorage.getItem("list"));

        cardArray.forEach(element => {
            listArea.innerHTML +=
                `
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-header-title">${element.title}</h4>
                        <input type="hidden" id="objId" value="${element.id}"/>
                        <a id="deleteCard" class="card-header-trash"><i class="fa-sharp fa-solid fa-trash-can"></i></a>
                        <a id="editCard" class="card-header-edit"><i class="fa-solid fa-pen-to-square"></i></a>
                        <a id="saveCard" class="card-header-save"><i class="fa-solid fa-bookmark"></i></a>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${element.category}</h5>
                        <p class="card-text">${element.desc}</p>
                        <a href="#" class="btn btn-outline-info">${element.price + " ₺"}</a>
                    </div>
                </div>
            `;
        });
    } else {
        alertDisplay("Kayıtlı Veri Bulunamadı")
    };
};


window.addEventListener("DOMContentLoaded", function () {
    getList();
    deleteCardItem();
    editCardItem();
});


// kullanıcıdan alınan değerleri ekleme fonksiyonu
function addItemList(e) {
    // bu if bloğunda input'lardan alınan veri kontrolleri yapılıyor ve kullanıcı tarafından girilen verilen cardArray dizisine push ediliyor.
    if (titleItem.value !== "" && categoryItem.value !== "" && priceItem.value !== "" && descItem.value !== "") {
        cardArray.push({ title: titleItem.value, id: randomId(), category: categoryItem.value, price: priceItem.value, desc: descItem.value });

        // burda da kullanıcıdan alınan veriler cardArray'a atıldıktan sonra string formata çevrilip localStorage'a atılıyor.
        localStorage.setItem("list", JSON.stringify(cardArray));
        listArea.innerHTML = "";
        getList();

        titleItem.value = "";
        categoryItem.value = "";
        priceItem.value = "";
        descItem.value = "";
        alertDisplay("Başarıyla Eklendi!");
    } else {
        alertDisplay("Kaydedilecek Veri Girmediniz.");
    };
};

// arama yapmamızı sağlayacak function
function getItem(query) {
    return cardArray.filter(product => (product.title.indexOf(query) > -1));
};

// arama yapacağımız ve getItem fonksiyonunu kullanacağımız kısım
text.addEventListener("keyup", function (e) {
    var query = e.target.value;
    if (query !== "") {
        const textArea = getItem(query);
        listArea.innerHTML = "";
        for (let i = 0; i < textArea.length; i++) {
            const element = textArea[i];
            listArea.innerHTML +=
                `
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-header-title">${element.title}</h4>
                        <input type="hidden" id="objId" value="${element.id}"/>
                        <a id="deleteCard" class="card-header-trash"><i class="fa-sharp fa-solid fa-trash-can"></i></a>
                        <a id="editCard" class="card-header-edit"><i class="fa-solid fa-pen-to-square"></i></a>
                        <a id="saveCard" class="card-header-save"><i class="fa-solid fa-bookmark"></i></a>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${element.category}</h5>
                        <p class="card-text">${element.desc}</p>
                        <a href="#" class="btn btn-outline-info">${element.price + " ₺"}</a>
                    </div>
                </div>
                `;
        };
        alertDisplay("Bulunan Sonuçlar Listeleniyor...")
        deleteCardItem();
        editCardItem();
    }
    else {
        listArea.innerHTML = "";
        getList();
        alertDisplay("Kayıtlı Veriler Listeleniyor...");
    };
});

// TEK TEK SİLME FONKSİYONU
function deleteCardItem() {
    const objId = document.querySelectorAll("#deleteCard");

    objId.forEach(deleteId => {
        deleteId.addEventListener("click", function () {
            let cardId = deleteId.previousElementSibling.value;
            // let findIndexId = cardArray.findIndex(a => a.id == cardId);
            let findIndexId = cardArray.findIndex(function (a) {
                return a.id === cardId;
            });
            cardArray.splice(findIndexId, 1);
            listArea.innerHTML = "";
            localStorage.setItem("list", JSON.stringify(cardArray));
            getList();
            // reloadWindows();
        });
    });
};

// DÜZENLEME FONKSİYONU
function editCardItem() {
    const editCardBtn = document.querySelectorAll("#editCard");

    editCardBtn.forEach(editCardElem => {
        editCardElem.addEventListener("click", function () {
            const editText = editCardElem.parentElement.firstElementChild.textContent;

            cardArray.filter(onCard => {
                const titleText = onCard.title;
                if (editText === titleText) {
                    const saveCardElem = editCardElem.nextElementSibling;
                    editCardElem.style.display = "none"
                    saveCardElem.style.display = "block"
                    saveBtn.setAttribute("disabled", "");


                    titleItem.value = onCard.title;
                    categoryItem.value = onCard.category;
                    priceItem.value = onCard.price;
                    descItem.value = onCard.desc;

                    saveCardElem.addEventListener("click", function () {
                        const clickId = saveCardElem.previousElementSibling.previousElementSibling.previousElementSibling.value;
                        const findIndexSaveId = cardArray.findIndex(saveId => saveId.id == clickId);

                        cardArray[findIndexSaveId] = ({ title: titleItem.value, id: clickId, category: categoryItem.value, price: priceItem.value, desc: descItem.value });

                        localStorage.setItem("list", JSON.stringify(cardArray));
                        listArea.innerHTML = "";
                        getList();
                    });
                };
            });
        });
    });
};

// TOPLU SİLME İŞLEMİ
const deleteList = document.querySelector("#deleteBtn");
deleteList.addEventListener("click", function () {
    if (localStorage.getItem("list")) {
        localStorage.clear();
        getList();
        alertDisplay("Tüm Listelenenler Silindi!");
        reloadWindows();
    } else {
        alertDisplay("Silinecek Veri Bulunmamaktadır!")
    };
});
