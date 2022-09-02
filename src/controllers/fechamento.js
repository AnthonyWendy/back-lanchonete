const { validationResult, matchedData } = require("express-validator");

const Fechamento = require("../models/fechamento.js");
const Comanda = require("../models/comanda.js");

module.exports = {
    addPagamento: async (req, res) => {

        let { pagamento } = req.body;
        let {id} = req.params;
        

        let deuboa = 0;
        

        if (!id) {
            return res.status(400).json({
                error: "Comanda inválida",
            });
        }

        const comanda = await Comanda.findOne({
            where: {id_comanda: id}
        });
        console.log(comanda);
        if(!comanda){
            return res.status(400).json({
                error: "Comanda não existe",
            });
        }

        comanda.situacao = 0;
        await comanda.save();

        console.log(pagamento)
        console.log(pagamento.pix);

        if(pagamento.pix){
            const pagado = await Fechamento.create({
                id_comanda: id,
                idformapagamento: 2,
                valor: pagamento.pix
            })
            deuboa++;
        }
        if(pagamento.debito){
            const pagado = await Fechamento.create({
                id_comanda: id,
                idformapagamento: 1,
                valor: pagamento.debito

            })
            console(pagado)
            deuboa++;
        }
        if(pagamento.credito){
            const pagado = await Fechamento.create({
                id_comanda: id,
                idformapagamento: 3,
                valor: pagamento.credito
            })
            console(pagado)
            deuboa++;
        }



        return res.json({
            deuboa
        });
    },
};