import {createPage} from "./src/Page.js";

(async () => {
    try{
        const {page, browser} = await createPage();

        await Login(page);
        await Simulate(page);

        // await browser.close();
    }catch (error){
        console.log("END ERROR", error);
    }
})();

const Login = async (page) => {
    await page.waitForSelector('input',{timeout:5000});
    await page.type('input[type=text]', "heitorflorido@gmail.com");
    await page.type('input[type=password]', "1234567890");
    await page.click('.MuiButton-containedPrimary');
}

const Simulate = async (page) => {
    await selecionarProduto(page);
    await preencherDadosCliente(page);
    await preencherDadosProduto(page);
    await selecionarPlano(page);
    await enviarDocsEFinalizar(page);
}

const selecionarProduto = async (page) =>{
    const simuladorBtn = await page.waitForSelector('ul span ::-p-text(Simulador)',{timeout:5000});
    await simuladorBtn.click();

    const aquisicaoBtn = await page.waitForSelector('[data-testid="HouseIcon"]',{timeout:5000});
    await aquisicaoBtn.click();

    const nextStep = await page.waitForSelector('button:not([disabled]) ::-p-text(PRÓXIMA ETAPA)',{timeout:5000})
    await nextStep.click();
}

const preencherDadosCliente = async (page) =>{
    await page.waitForSelector(`input`);
    let inputs = await page.$$(`input`);

    await inputs[0].click();

    await page.waitForSelector('.MuiAutocomplete-popper',{timeout:5000, visible:true});
    const option = await page.waitForSelector(`.MuiAutocomplete-popper ::-p-text(AAI CONTROLE LTDA)`);
    await option.click();
    await page.waitForSelector('.MuiAutocomplete-popper',{timeout:100, visible:false}).catch(e=>console.log(e));

    await inputs[1].type(gerarCpf());
    await inputs[2].type("Raphael Caetano");
    await inputs[3].type("10101990");
    await inputs[4].type("1000");
    await inputs[5].type("11123451234");
    await inputs[6].type("teste@teste.com.br");

    const nextStep = await page.waitForSelector('button:not([disabled]) ::-p-text(CONTINUAR)',{timeout:5000});
    await nextStep.click();
}

const preencherDadosProduto = async (page) =>{
    const residencialBtn = await page.waitForSelector('[data-testid="HomeOutlinedIcon"]',{timeout:5000});
    await residencialBtn.click();


    const inputs = await page.$$(`input`);

    await inputs[2].click();

    await page.waitForSelector('.MuiList-root',{timeout:5000, visible:true});
    const option = await page.waitForSelector(`.MuiList-root ::-p-text(SP)`);
    await option.click();
    await page.waitForSelector('.MuiList-root',{timeout:100, visible:false}).catch(e=>console.log(e));

    await inputs[3].type("100000");
    await inputs[4].type("80000");
    await inputs[5].type("60");

    const nextStep = await page.waitForSelector('button:not([disabled]) ::-p-text(CALCULAR)',{timeout:5000});
    await nextStep.click();
}

const selecionarPlano = async (page) =>{
    await page.waitForSelector('.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded img',{timeout:10000}).catch(e => console.log(e));
    const segments = await page.$$(`.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded`);

    for (const segment of segments){
        const title = await page.evaluate(
            (el) => el.querySelector('h3').textContent,
            segment
        );

        if(title !== 'Taxa + TR'){
            continue
        }

        await page.evaluate(
            (el) => {
                const options = el.querySelectorAll('img');

                let index = null

                for (let i = 0; i < options.length; i++) {
                    const banco = options[i].parentNode.parentNode.querySelectorAll('div')[2].textContent;

                    if(banco === 'Santander'){
                        index = i;
                    }
                }

                el.querySelectorAll('.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded .MuiButton-contained')[index].click();
            },
            segment
        );
    }

    const nextStep = await page.waitForSelector('button:not([disabled]) ::-p-text(REVISAR CONDIÇÕES SELECIONADAS)',{timeout:5000});
    await nextStep.click();
}

const enviarDocsEFinalizar = async (page) =>{
    const comecar = await page.waitForSelector('button:not([disabled]) ::-p-text(COMEÇAR)',{timeout:5000});

    let inputs = await page.$$(`input`);
    await inputs[0].click();

    await comecar.click();

    const enviar = await page.waitForSelector('button:not([disabled]) ::-p-text(ENVIAR PARA ANÁLISE DE CRÉDITO)',{timeout:10000});
    await enviar.click();

    await page.waitForSelector('button:not([disabled]) ::-p-text(ACESSAR)',{timeout:10000});
    const acessar = await page.$$('.MuiButton-textPrimary',{timeout:10000});

    await acessar[1].click()

    const documentos = await page.waitForSelector('button:not([disabled]) ::-p-text(Documentos)',{timeout:10000});
    await documentos.click();

    const credito = await page.waitForSelector('h3 ::-p-text(Crédito)',{timeout:10000});
    await credito.click();

    const elementHandle = await page.$("input[type=file]");
    await elementHandle.uploadFile('src/assets/pdfTeste.pdf');

}

function gerarCpf() {
    const num1 = aleatorio();
    const num2 = aleatorio();
    const num3 = aleatorio();
    const dig1 = dig(num1, num2, num3);
    const dig2 = dig(num1, num2, num3, dig1);
    return `${num1}.${num2}.${num3}-${dig1}${dig2}`;
}

function dig(n1, n2, n3, n4) {
    const nums = n1.split("").concat(n2.split(""), n3.split(""));
    if (n4 !== undefined){
        nums[9] = n4;
    }

    let x = 0;
    for (let i = (n4 !== undefined ? 11:10), j = 0; i >= 2; i--, j++) {
        x += parseInt(nums[j]) * i;
    }

    const y = x % 11;
    return y < 2 ? 0 : 11 - y;
}

function aleatorio() {
    const aleat = Math.floor(Math.random() * 999);
    return ("" + aleat).padStart(3, '0');
}
