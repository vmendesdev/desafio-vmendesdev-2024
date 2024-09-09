    class RecintosZoo {

        constructor() {
            // Definindo os recintos e suas características
            this.recintos = {
                1: { bioma: 'savana', tamanho: 10, animais: { macaco: 3 } },
                2: { bioma: 'floresta', tamanho: 5, animais: {} },
                3: { bioma: 'savana e rio', tamanho: 7, animais: { gazela: 1 } },
                4: { bioma: 'rio', tamanho: 8, animais: {} },
                5: { bioma: 'savana', tamanho: 9, animais: { leão: 1 } }
            };

            // Definindo o tamanho, bioma e outras características para cada animal
            this.animais = {
                LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
                LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
                CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
                MACACO: { tamanho: 1, biomas: ['savana', 'floresta', 'savana e rio'], carnivoro: false },
                GAZELA: { tamanho: 2, biomas: ['savana', 'savana e rio'], carnivoro: false },
                HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
            };
        }

        analisaRecintos(animal, quantidade) {
    // Validação inicial
    if (!this.animais[animal]) return { erro: 'Animal inválido' };
    if (quantidade <= 0 || !Number.isInteger(quantidade)) return { erro: 'Quantidade inválida' };

    // Adiciona a regra especial para macacos
    if (animal === 'MACACO' && quantidade >= 10) return { erro: 'Não há recinto viável' };

    const recintosViaveis = [];
    const animalInfo = this.animais[animal];
    const isCarnivoro = animalInfo.carnivoro;

    for (const [nro, recinto] of Object.entries(this.recintos)) {
        // Valida se o bioma do recinto é adequado para o animal
        const biomaAdequado = this.biomaAdequado(recinto.bioma, animal);
        if (!biomaAdequado) continue;

        let espacoLivre = recinto.tamanho;
        let podeAcomodar = true;

        // Verifica regras específicas de animais já presentes no recinto
        for (const [esp, qtd] of Object.entries(recinto.animais)) {
            const especie = esp.toUpperCase();
            const infoEspecie = this.animais[especie];

            if (!infoEspecie) {
                podeAcomodar = false;
                break;
            }

            const espacoOcupado = infoEspecie.tamanho * qtd;
            espacoLivre -= espacoOcupado;

            // Regras baseadas em se o animal é carnívoro
            if (isCarnivoro && especie !== animal) {
                podeAcomodar = false;
                break;
            }

            // Macacos não podem estar com carnívoros
            if (animal === 'MACACO' && infoEspecie.carnivoro) {
                podeAcomodar = false;
                break;
            }

            // Macacos e gazelas têm regras especiais
            if (animal === 'MACACO' && especie === 'GAZELA') {
                if (recinto.bioma === 'savana e rio') {
                    espacoLivre -= 1; // Considera um espaço extra
                } else {
                    podeAcomodar = false;
                    break;
                }
            }

            if (animal === 'GAZELA' && especie === 'MACACO' && recinto.bioma !== 'savana e rio') {
                podeAcomodar = false;
                break;
            }

            if (animal === 'MACACO' && recinto.bioma === 'floresta' && quantidade !== 2) {
                podeAcomodar = false;
                break;
            }
        }

        if (podeAcomodar) {
            const espacoNecessario = animalInfo.tamanho * quantidade;
            if (espacoLivre >= espacoNecessario) {
                recintosViaveis.push(`Recinto ${nro} (espaço livre: ${espacoLivre - espacoNecessario} total: ${recinto.tamanho})`);
            }
        }
    }

    return recintosViaveis.length > 0
        ? { recintosViaveis: recintosViaveis.sort() }
        : { erro: 'Não há recinto viável' };
    }

    biomaAdequado(bioma, animal) {
    const biomasValidos = this.animais[animal].biomas;
    const biomas = bioma.split(' e ');
    return biomas.some(b => biomasValidos.includes(b));
    }
    }

    export { RecintosZoo as RecintosZoo };
