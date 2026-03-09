

document.addEventListener("DOMContentLoaded", () => {
    // --- SELETORES GLOBAIS ---
    const cartIcon = document.querySelector(".cart-icon"),
        cartSidebar = document.querySelector(".cart-sidebar"),
        cartOverlay = document.querySelector(".cart-overlay"),
        closeCartBtn = document.querySelector(".close-cart-btn"),
        cartBody = document.querySelector(".cart-body"),
        cartBadge = document.querySelector(".cart-badge");
    const deliveryToggleBtns = document.querySelectorAll(".delivery-btn");
    const deliveryForm = document.getElementById("delivery-form-container"),
        pickupForm = document.getElementById("pickup-form-container");
    const trocoContainer = document.getElementById("troco-container");
    const couponInput = document.getElementById("coupon-input"),
        applyCouponBtn = document.getElementById("apply-coupon-btn"),
        couponFeedback = document.getElementById("coupon-feedback");
    const subtotalElem = document.getElementById("cart-subtotal"),
        cartDiscountElem = document.getElementById("cart-discount"),
        discountLineElem = document.querySelector(".discount-line"),
        totalElem = document.getElementById("cart-total");
    const finishOrderBtn = document.getElementById("finish-order-btn");
    // Seletores da barra inferior
    const viewCartBanner = document.querySelector(".view-cart-banner");
    const bannerTotalElem = document.getElementById("banner-total");
    const viewCartBannerBtn = document.querySelector(".view-cart-banner-btn");

    // Seletores para o sistema de filtro
    const categoryBtns = document.querySelectorAll(".category-btn");
    const searchInput = document.querySelector(".search-input");

    // --- ESTADO DA APLICAÇÃO ---
    const produtos = [
        {
            id: 1,
            nome: "AÇAÍ MÉDIO 1 LITRO",
            categoria: "Líquidos", 
            preco: 20,
            imagem:
                "assets/açai-litros.png",
            descricao: "Açaí Médio 1 Litro - Delicioso e Ótima Qualidade",
        },
        {
            id: 2,
            nome: "FARINHA DE TAPIOCA",
            categoria: "Farinhas", /*laptops*/
            preco: 3,
            imagem:
                "assets/farinha-de-tapioca.png",
            descricao: "Farinha de tapioca, ótimo para uma opção com açaí",
        },
        {
            id: 3,
            nome: "BACABA",
            categoria: "Líquidos", /*smartphones*/
            preco: 18,
            imagem:
                "assets/Bacaba.png",
            descricao: "Bacaba boa opção para o cliente",
        },
        {
            id: 4,
            nome: "CHARQUE BOVINO",
            categoria: "Complemento", /*smartphones*/
            preco: 30,
            imagem:
                "assets/Charque.png",
            descricao: "Charque Bovino, ótima opção para você que gosta do açaí com complemento",
        },
        {
            id: 5,
            nome: "FARINHA DE MANDIOCA",
            categoria: "Farinhas", /*smartwatch*/
            preco: 10,
            imagem:
                "assets/FARINHA-1.png",
            descricao: "Farinha de Mandioca, gostosa torrada ótima opção com açaí",
        },
        {
            id: 6,
            nome: "Banner da Empresa",
            categoria: "Propaganda",
            preco: 0,
            imagem:
                "assets/maquina-pix.png",
            descricao: "Aceitamos Pix, Débido e Crédito",
        },
        {
            id: 7,
            nome: "AÇAÍ MEIO LITRO",
            categoria: "Líquidos", /*headphones*/
            preco: 10,
            imagem:
                "assets/açai-meio-litro.png",
            descricao: "1/2 Litro de Açaí - Porção na medida",
        },
        {
            id: 8,
            nome: "Espaço Propaganda",
            categoria: "Propaganda", /*laptops*/
            preco: 0,
            imagem:
                "assets/Propaganda-1.png",
            descricao: "Propaganda",
        },
        // {
        //     id: 9,
        //     nome: "Capa de Silicone iPhone",
        //     categoria: "accessories",
        //     preco: 299,
        //     imagem:
        //         "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MPU63?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1661472856272",
        //     descricao: "Proteção e estilo para seu iPhone",
        // },
        // {
        //     id: 10,
        //     nome: "Carregador MagSafe",
        //     categoria: "accessories",
        //     preco: 450,
        //     imagem:
        //         "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXH3?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1661269784338",
        //     descricao: "Carregamento sem fio rápido e fácil",
        // },
    ];
    const validCoupons = [{ code: "DESCONTO10", type: "percentage", value: 10 }];
    let carrinho = [],
        tipoEntrega = "delivery",
        appliedCoupon = null;

    // Variáveis de estado para filtros
    let categoriaAtiva = "all";
    let termoBusca = "";

    const formatarMoeda = (v) =>
        v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const getScrollbarWidth = () =>
        window.innerWidth - document.documentElement.clientWidth;
    const lockScroll = () => {
        document.body.style.paddingRight = `${getScrollbarWidth()}px`;
        document.body.classList.add("no-scroll");
    };
    const unlockScroll = () => {
        document.body.style.paddingRight = "";
        document.body.classList.remove("no-scroll");
    };
    const abrirCarrinho = () => {
        cartSidebar.classList.add("show");
        cartOverlay.classList.add("show");
        lockScroll();
    };
    const fecharCarrinho = () => {
        cartSidebar.classList.remove("show");
        cartOverlay.classList.remove("show");
        unlockScroll();
    };

    const animacaoVoarParaCarrinho = (productCard) => {
        const productImg = productCard.querySelector(".product-img"),
            imgRect = productImg.getBoundingClientRect(),
            cartRect = cartIcon.getBoundingClientRect(),
            flyingImg = document.createElement("img");
        flyingImg.src = productImg.src;
        flyingImg.classList.add("product-image-fly");
        flyingImg.style.left = `${imgRect.left}px`;
        flyingImg.style.top = `${imgRect.top}px`;
        flyingImg.style.width = `${imgRect.width}px`;
        flyingImg.style.height = `${imgRect.height}px`;
        document.body.appendChild(flyingImg);
        requestAnimationFrame(() => {
            flyingImg.style.left = `${cartRect.left + cartRect.width / 2}px`;
            flyingImg.style.top = `${cartRect.top + cartRect.height / 2}px`;
            flyingImg.style.width = "0px";
            flyingImg.style.height = "0px";
            flyingImg.style.opacity = "0";
        });
        flyingImg.addEventListener("transitionend", () => flyingImg.remove());
    };

    // Função para filtrar e mostrar produtos
    const filtrarEMostrarProdutos = () => {
        let produtosFiltrados = produtos;

        // Filtro por categoria
        if (categoriaAtiva !== "all") {
            produtosFiltrados = produtosFiltrados.filter(
                (produto) => produto.categoria === categoriaAtiva,
            );
        }

        // Filtro por busca
        if (termoBusca.trim() !== "") {
            const termo = termoBusca.toLowerCase();
            produtosFiltrados = produtosFiltrados.filter(
                (produto) =>
                    produto.nome.toLowerCase().includes(termo) ||
                    produto.descricao.toLowerCase().includes(termo),
            );
        }

        // Renderizar produtos filtrados
        const container = document.querySelector(".products-container");
        if (produtosFiltrados.length === 0) {
            container.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #f8f405;">
                            <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <p style="font-size: 1.2rem; font-weight: 600;">Nenhum produto encontrado</p>
                        </div>
                    `;
        } else {
            container.innerHTML = produtosFiltrados
                .map(
                    (p) => `
                        <div class="product-card" data-id="${p.id}">
                            <img class="product-img" src="${p.imagem}" alt="${p.nome}">
                            <div class="product-info">
                                <h3 class="product-name">${p.nome}</h3>
                                <p class="product-description">${p.descricao}</p>
                                <p class="product-price">${formatarMoeda(p.preco)}</p>
                                <button class="product-button">Comprar</button>
                            </div>
                        </div>
                    `,
                )
                .join("");
        }
    };

    const adicionarAoCarrinho = (produtoId, productCard) => {
        if (productCard) animacaoVoarParaCarrinho(productCard);
        const produto = produtos.find((p) => p.id === produtoId),
            itemNoCarrinho = carrinho.find((item) => item.id === produtoId);
        if (itemNoCarrinho) itemNoCarrinho.quantidade++;
        else carrinho.push({ ...produto, quantidade: 1 });
        atualizarCarrinho();
    };

    const alterarQuantidade = (produtoId, acao) => {
        const item = carrinho.find((i) => i.id === produtoId);
        if (!item) return;
        if (acao === "aumentar") item.quantidade++;
        else if (acao === "diminuir") {
            item.quantidade--;
            if (item.quantidade <= 0)
                carrinho = carrinho.filter((i) => i.id !== produtoId);
        }
        atualizarCarrinho();
    };

    const atualizarCarrinho = () => {
        if (carrinho.length === 0) {
            cartBody.innerHTML = `<div class="cart-empty"><i class="fa-solid fa-box-open"></i><p>Seu carrinho está vazio.</p></div>`;
        } else {
            cartBody.innerHTML = carrinho
                .map(
                    (item) =>
                        `<div class="cart-item" data-id="${item.id}"><img src="${item.imagem}" alt="${item.nome}" class="cart-item-img"><div class="cart-item-info"><h4 class="cart-item-name">${item.nome}</h4><p class="cart-item-price">${formatarMoeda(item.preco)}</p><div class="cart-item-controls"><button class="quantity-btn" data-action="diminuir">-</button><span class="quantity">${item.quantidade}</span><button class="quantity-btn" data-action="aumentar">+</button></div></div><button class="remove-item-btn">&times;</button></div>`,
                )
                .join("");
        }
        const subtotal = carrinho.reduce(
            (acc, item) => acc + item.preco * item.quantidade,
            0,
        );
        let discountAmount = 0;
        if (appliedCoupon && appliedCoupon.type === "percentage")
            discountAmount = subtotal * (appliedCoupon.value / 100);
        const total = subtotal - discountAmount;
        subtotalElem.textContent = formatarMoeda(subtotal);
        if (discountAmount > 0) {
            cartDiscountElem.textContent = `- ${formatarMoeda(discountAmount)}`;
            discountLineElem.style.display = "flex";
        } else {
            discountLineElem.style.display = "none";
        }
        totalElem.textContent = formatarMoeda(total);
        cartBadge.textContent = carrinho.reduce(
            (acc, item) => acc + item.quantidade,
            0,
        );
        finishOrderBtn.disabled = carrinho.length === 0;

        if (carrinho.length > 0 && window.innerWidth <= 768) {
            bannerTotalElem.textContent = formatarMoeda(total);
            viewCartBanner.classList.add("show");
        } else {
            viewCartBanner.classList.remove("show");
        }
    };

    const applyCoupon = () => {
        const code = couponInput.value.trim().toUpperCase(),
            foundCoupon = validCoupons.find((c) => c.code === code);
        couponFeedback.classList.remove("success", "error");
        if (foundCoupon) {
            appliedCoupon = foundCoupon;
            couponFeedback.textContent = "Cupom aplicado!";
            couponFeedback.classList.add("success");
        } else {
            appliedCoupon = null;
            couponFeedback.textContent = "Cupom inválido.";
            couponFeedback.classList.add("error");
        }
        atualizarCarrinho();
    };

    const finalizarPedido = () => {
        let valid = true;
        let fieldsToValidate = [];

        if (tipoEntrega === "delivery") {
            fieldsToValidate = [
                "delivery-name",
                "delivery-phone",
                "delivery-cep",
                "delivery-address",
            ];
        } else {
            fieldsToValidate = ["pickup-name", "pickup-date", "pickup-time"];
        }

        fieldsToValidate.forEach((id) => {
            const el = document.getElementById(id);
            let isFieldValid = el.value.trim() !== "";

            if (id.includes("name") && isFieldValid) {
                if (
                    el.value
                        .trim()
                        .split(" ")
                        .filter((word) => word).length < 2
                ) {
                    isFieldValid = false;
                }
            }

            if (!isFieldValid) {
                el.classList.add("error");
                valid = false;
            } else {
                el.classList.remove("error");
            }
        });

        if (!valid) {
            alert(
                "Por favor, preencha todos os campos obrigatórios marcados em vermelho.",
            );
            return;
        }

        const numeroWhatsApp = "558182362638";
        const itensPedido = carrinho
            .map((item) => `  - ${item.quantidade}x ${item.nome}`)
            .join("\n");
        const subtotal = carrinho.reduce(
            (acc, item) => acc + item.preco * item.quantidade,
            0,
        );
        let discountAmount = 0,
            cupomInfo = "";
        if (appliedCoupon) {
            discountAmount = subtotal * (appliedCoupon.value / 100);
            cupomInfo = `\n*Cupom Aplicado:* ${appliedCoupon.code} (${formatarMoeda(discountAmount)})`;
        }
        const total = subtotal - discountAmount;
        let mensagem = `*-- NOVO PEDIDO TechStore --*\n\n*Itens:*\n${itensPedido}\n\n*Subtotal:* ${formatarMoeda(subtotal)}${cupomInfo}\n*Total:* ${formatarMoeda(total)}\n\n-------------------------\n\n`;

        if (tipoEntrega === "delivery") {
            const nome = document.getElementById("delivery-name").value;
            const phone = document.getElementById("delivery-phone").value;
            const address = document.getElementById("delivery-address").value;

            const paymentMethod = document.querySelector(
                'input[name="payment"]:checked',
            ).value;
            let paymentInfo = `*Forma de Pagamento:* ${paymentMethod}`;
            if (paymentMethod === "Dinheiro") {
                const troco = document.getElementById("troco-para").value;
                paymentInfo += troco
                    ? ` (Troco para R$ ${troco})`
                    : " (Não precisa de troco)";
            }
            mensagem += `*Tipo de Pedido:* Entrega\n\n*Nome:* ${nome}\n*Telefone:* ${phone}\n*Endereço:* ${address}\n\n${paymentInfo}`;
        } else {
            const nome = document.getElementById("pickup-name").value;
            const dataInput = document.getElementById("pickup-date").value;
            const hora = document.getElementById("pickup-time").value;
            const [year, month, day] = dataInput.split("-");
            const dataFormatada = `${day}/${month}/${year}`;

            mensagem += `*Tipo de Pedido:* Retirada\n\n*Nome para Retirada:* ${nome}\n*Data Agendada:* ${dataFormatada}\n*Hora Agendada:* ${hora}`;
        }

        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, "_blank");
    };

    // --- EVENT LISTENERS ---
    cartIcon.addEventListener("click", abrirCarrinho);
    closeCartBtn.addEventListener("click", fecharCarrinho);
    cartOverlay.addEventListener("click", fecharCarrinho);
    applyCouponBtn.addEventListener("click", applyCoupon);
    finishOrderBtn.addEventListener("click", finalizarPedido);
    viewCartBannerBtn.addEventListener("click", abrirCarrinho);

    // Event listener para botões de categoria
    categoryBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Remove classe active de todos os botões
            categoryBtns.forEach((b) => b.classList.remove("active"));
            // Adiciona classe active no botão clicado
            btn.classList.add("active");
            // Atualiza categoria ativa
            categoriaAtiva = btn.dataset.category;
            // Filtra e mostra produtos
            filtrarEMostrarProdutos();
        });
    });

    // Event listener para campo de busca
    searchInput.addEventListener("input", (e) => {
        termoBusca = e.target.value;
        filtrarEMostrarProdutos();
    });

    document
        .querySelector(".products-container")
        .addEventListener("click", (e) => {
            if (e.target.matches(".product-button")) {
                const productCard = e.target.closest(".product-card");
                adicionarAoCarrinho(
                    Number.parseInt(productCard.dataset.id),
                    productCard,
                );
            }
        });
    cartBody.addEventListener("click", (e) => {
        const cartItem = e.target.closest(".cart-item");
        if (cartItem) {
            const produtoId = Number.parseInt(cartItem.dataset.id);
            if (e.target.matches(".quantity-btn"))
                alterarQuantidade(produtoId, e.target.dataset.action);
            if (e.target.matches(".remove-item-btn")) {
                carrinho = carrinho.filter((i) => i.id !== produtoId);
                atualizarCarrinho();
            }
        }
    });

    deliveryToggleBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
            deliveryToggleBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            tipoEntrega = btn.dataset.option;
            if (tipoEntrega === "delivery") {
                deliveryForm.style.display = "block";
                pickupForm.style.display = "none";
            } else {
                deliveryForm.style.display = "none";
                pickupForm.style.display = "block";
            }
        }),
    );

    document.querySelectorAll('input[name="payment"]').forEach((radio) => {
        radio.addEventListener("change", (e) => {
            trocoContainer.style.display =
                e.target.value === "Dinheiro" ? "block" : "none";
            document
                .querySelectorAll(".payment-option")
                .forEach((label) => label.classList.remove("selected"));
            e.target.closest(".payment-option").classList.add("selected");
        });
    });

    // Remove o erro ao digitar
    document
        .querySelectorAll(
            "#delivery-form-container input[required], #pickup-form-container input[required], #pickup-form-container select[required]",
        )
        .forEach((input) => {
            input.addEventListener("input", () => {
                if (input.value.trim() !== "") input.classList.remove("error");
            });
        });

    // --- INICIALIZAÇÃO ---
    filtrarEMostrarProdutos();
    atualizarCarrinho();
});




//  VERSAO BOTAÕ LOGIM CRIADO POR IA DOLA 

// Seleciona o botão da página home
const btnMostrarLogin = document.getElementById('btnMostrarLogin');
const modalLogin = document.getElementById('loginModal');
const btnAbrirPainel = document.getElementById('btnAbrirPainel');

btnMostrarLogin.onclick = () => {
  modalLogin.style.display = 'flex'; // mostra o modal
};

const senhaCorreta = "123456"; // exemplo de senha

function verificarSenha() {
  const senha = document.getElementById('senha').value;
  if (senha === senhaCorreta) {
    modalLogin.style.display = 'none'; // esconde modal
    btnAbrirPainel.style.display = 'inline-block'; // mostra botão
  } else {
    alert('Senha incorreta. Tente novamente.');
    document.getElementById('senha').value = '';
  }
}

// //  VERSÃO CRIADA PELA IA DOLA Painel ADM

// // Senha definida
const senhaCorreta = "getec12345"; // Troque pela senha desejada

function verificarSenha() {
  const senhaInput = document.getElementById('senha').value;
  if (senhaInput === senhaCorreta) {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('btnAbrirPainel').style.display = 'inline-block';
  } else {
    alert('Senha incorreta. Tente novamente.');
    document.getElementById('senha').value = '';
  }
}

// // Abrir painel após login
// document.getElementById('btnAbrirPainel').onclick = function() {
//   abrirPainel(); // sua função para abrir o painel
// };

// // Funções do painel (exemplo)
// let produtos = [
//     { id: 1, nome: "Produto 1", preco: 10.00, quantidade: 5 },
//     { id: 2, nome: "Produto 2", preco: 20.00, quantidade: 3 },
// ];

// function abrirPainel() {
//   document.getElementById('admin-panel').style.display = 'block';
//   listarProdutos();
// }

// function fecharPainel() {
//   document.getElementById('admin-panel').style.display = 'none';
// }

// function listarProdutos() {
//   const tbody = document.getElementById('lista-produtos');
//   tbody.innerHTML = '';
//   produtos.forEach(prod => {
//     const tr = document.createElement('tr');
//     tr.innerHTML = `
//       <td>${prod.nome}</td>
//       <td>R$ ${prod.preco.toFixed(2)}</td>
//       <td>${prod.quantidade}</td>
//       <td><button onclick="editarProduto(${prod.id})">Editar</button></td>
//     `;
//     tbody.appendChild(tr);
//   });
// }

function editarProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (produto) {
    document.getElementById('produto-id').value = produto.id;
    document.getElementById('nome-produto').value = produto.nome;
    document.getElementById('preco-produto').value = produto.preco;
    document.getElementById('quantidade-produto').value = produto.quantidade;
  }
}

function salvarProduto() {
  const id = parseInt(document.getElementById('produto-id').value);
  const nome = document.getElementById('nome-produto').value;
  const preco = parseFloat(document.getElementById('preco-produto').value);
  const quantidade = parseInt(document.getElementById('quantidade-produto').value);
  const index = produtos.findIndex(p => p.id === id);
  if (index > -1) {
    produtos[index] = { id, nome, preco, quantidade };
    alert('Produto atualizado!');
    listarProdutos();
  }
}

//  FIM DO CÓDIGO DE LOGIN DO PAINEL ADM, O RESTANTE DO CÓDIGO É DO SITE NORMAL, COM O SISTEMA DE FILTRO, CARRINHO, ENTREGA E RETIRADA, CUPOM DE DESCONTO E FINALIZAÇÃO DO PEDIDO VIA WHATSAPP

