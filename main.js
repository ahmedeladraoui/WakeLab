import axios from 'https://cdn.jsdelivr.net/npm/axios@1.7.9/+esm';  
let url = 'http://localhost:3000/api/activites'

async function getData(url){
    const res = await axios.get(url)
    const data = await res.data
    console.log(data)
    afficherDat(data)
}
getData(url)
let cardsContainer = document.getElementById("cardsContainer")
let formAjoute = document.forms.forAjoute
console.log("form=>",formAjoute)


function afficherDat(data) {
    cardsContainer.textContent = ''

    data.forEach(element => {
        cardsContainer.append(divCard(element))
    })
}

async function ajouterActivites(url,data){
    await axios.post(url,data)
    .then(res=>window.alert('ajouter avec success!',res))
    .catch(err=> console.error('il y a un erreru: ',err.message))
}


document.getElementById('forAjoute').addEventListener('submit', (event) => {
    event.preventDefault()

    const duree = Number(formAjoute.duree.value.trim())
    const theme = formAjoute.theme.value.trim()
    const titre = formAjoute.titre.value.trim()
    const auteur = formAjoute.auteur.value.trim()
    const description = formAjoute.description.value.trim()
    const objectifs = formAjoute.objectifs.value.trim()

    const errorDiv = document.getElementById('error-message')
    const themes = ["jeu", "apprentissage", "exercice", "autre"]
    const errors = []

    if (titre.length < 5 || titre.length > 100) {
        errors.push('Le titre doit contenir entre 5 et 100 caractères.');
    }

    if (!themes.includes(theme)) {
        errors.push('Le thème doit être : jeu, apprentissage, exercice, autre.')
    }

    if (!Number.isInteger(duree) || duree < 10 || duree > 20) {
        errors.push('La durée doit être un entier compris entre 10 et 20.')
    }

    if (description.length < 20 || description.length > 1000) {
        errors.push('La description doit contenir entre 20 et 1 000 caractères.')
    }

    if (!/^[a-zA-Z]+(\s+[a-zA-Z]+)+$/.test(auteur)) {
        errors.push('L’auteur doit être un nom complet contenant au moins deux parties.')
    }

    if (objectifs.length === 0) {
        errors.push('Les objectifs sont obligatoires.')
    }


    if (errors.length > 0) {
    let ul = document.createElement('ul')
    ul.className = 'list-disc pl-5 space-y-1'
    errors.forEach(e => {
        let li = document.createElement('li')
        li.textContent = e
        ul.append(li)
    })
    errorDiv.textContent = ''
    errorDiv.append(ul)
    errorDiv.classList.remove('hidden')
    errorDiv.classList.add('block')
    return
}

    errorDiv.textContent  = ''
    errorDiv.classList.add('hidden')

    let newActivite = {
        titre: titre,
        duree: duree,
        theme: theme,
        auteur: auteur,
        description: description,
        objectifs: objectifs
    }

    ajouterActivites(url, JSON.stringify(newActivite))
    getData(url)
    formAjoute.reset()
})



function divCard(data){

    let article = document.createElement('article')
    article.className = 'w-full rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700'
    article.setAttribute('data-id-activite',data.id)


    let input = document.createElement('input')
    input.setAttribute('type','checkbox')
    input.setAttribute('id',`details-${data.id}`)
    input.className = 'peer sr-only'


    let divThemDuree = document.createElement('div')
    divThemDuree.className = 'flex items-center justify-between gap-2'
    let spanThem = document.createElement('span')
    spanThem.className = 'rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
    spanThem.textContent = data.theme
    let spanDuree = document.createElement('span')
    spanDuree.className = 'text-xs text-stone-500 dark:text-stone-400'
    spanDuree.textContent = `${data.duree} min`
    
    

    let h2Titre = document.createElement('h2')
    h2Titre.className = 'mt-3 line-clamp-2 text-base font-bold leading-snug'
    h2Titre.textContent = data.titre



    let pDescription = document.createElement('p')
    pDescription.className = 'mt-2 line-clamp-3 text-sm text-stone-600 dark:text-stone-400'
    pDescription.textContent = data.description


    
        let divObjectifAuteur = document.createElement('div')
        divObjectifAuteur.className = 'mt-4 hidden space-y-3 border-t border-stone-200 pt-4 text-sm peer-checked:block dark:border-stone-800'
        let divObjectif = document.createElement('div')
        let pTitreObjectif = document.createElement('p')
        pTitreObjectif.textContent = 'objectifs'
        let pObjectifs = document.createElement('p')
        pObjectifs.textContent = data.objectifs
        
        let divAuteur = document.createElement('div')
        let pTitreAuteur = document.createElement('p')
        pTitreAuteur.className = 'font-semibold'
        pTitreAuteur.textContent = 'Auteur'
        let pAuteur = document.createElement('p')
        pAuteur.className = 'text-stone-600 dark:text-stone-400'
        pAuteur.textContent = data.auteur
        
        
        
        let divActions = document.createElement('div')
        divActions.className = 'mt-4 flex flex-wrap gap-2'
        
        let labelInput = document.createElement('label')
        labelInput.className = 'cursor-pointer rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400 peer-focus-visible:ring-offset-2'
        labelInput.setAttribute('for',`details-${data.id}`)
        labelInput.textContent = 'Details'

        let buttonModifier = document.createElement('button')
        buttonModifier.className = 'rounded-lg border border-stone-300 px-2.5 py-1 text-xs font-semibold hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800'
        buttonModifier.textContent = 'Modifier'
        
        let buttonSuppromer = document.createElement('button')
        buttonSuppromer.className = 'rounded-lg px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40'
        buttonSuppromer.textContent  = 'Supprimer'
        
        divObjectifAuteur.append(divObjectif, divAuteur)
        divObjectif.append(pTitreObjectif, pObjectifs)
        divAuteur.append(pTitreAuteur, pAuteur)
        divActions.append(labelInput,buttonModifier,buttonSuppromer)
        divThemDuree.append(spanThem, spanDuree)

        article.append(input,divThemDuree,h2Titre,pDescription,divObjectifAuteur,divActions)
    return article
}