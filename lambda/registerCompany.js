let companies = [];
exports.handler = async (event) => {

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event;

    const { cuit, razonSocial, tipo } = body;

    if (!cuit || cuit.length !== 11) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'CUIT inválido, debe tener 11 dígitos' }),
      };
    }

    if (!razonSocial || typeof razonSocial !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Razón social inválida' }),
      };
    }

    if (!['PYME', 'CORPORATIVA'].includes(tipo)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Tipo inválido, debe ser PYME o CORPORATIVA' }),
      };
    }

    const exists = companies.some(c => c.cuit === cuit);
    if (exists) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Ya existe una empresa con el CUIT ${cuit}` }),
      };
    }

    const newCompany = {
      id: Date.now().toString(),
      cuit,
      razonSocial,
      tipo,
      fechaAdhesion: new Date().toISOString(),
    };

    companies.push(newCompany);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Empresa registrada con éxito', company: newCompany }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno', details: error.message }),
    };
  }
};