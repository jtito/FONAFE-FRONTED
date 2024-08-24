import {Menu} from '../shared/models/menu';

export const OPCIONES: Menu[] = [
    {
        idMenu: 1,
        nombreMenu: 'Configuración',
        rutaMenu: '_/app/componente',
        iconoMenu: 'article',
        estado: '1',
        listaSubmenu: [

            {
                idSubmenu: 1,
                nombreSubmenu: 'Periodo',
                rutaSubmenu: '/pages/main/configuracion/periodo',
                iconoSubmenu: 'backup',
                estado: '1',
            },
            {
                idSubmenu: 2,
                nombreSubmenu: 'Empresa',
                rutaSubmenu: '/pages/main/configuracion/empresa',
                iconoSubmenu: 'backup',
                estado: '1',
            },
            {
                idSubmenu: 3,
                nombreSubmenu: 'Responsable',
                rutaSubmenu: '/pages/main/configuracion/responsable',
                iconoSubmenu: 'backup',
                estado: '1',
            },
            {
                idSubmenu: 4,
                nombreSubmenu: 'Matriz Nivel',
                rutaSubmenu: '/pages/main/configuracion/matrizNivel',
                iconoSubmenu: 'backup',
                estado: '1',
            },
            {
                idSubmenu: 5,
                nombreSubmenu: 'Escalas de nivel de riesgos',
                rutaSubmenu: '/pages/main/configuracion/dimensionMetodologia',
                iconoSubmenu: 'backup',
                estado: '1',
            },
            {
                idSubmenu: 6,
                nombreSubmenu: 'Indicador',
                rutaSubmenu: '/pages/main/configuracion/indicador',
                iconoSubmenu: 'backup',
                estado: '1',
            },
            {
                idSubmenu: 7,
                nombreSubmenu: 'Formato Correos',
                rutaSubmenu: '/pages/main/configuracion/correos',
                iconoSubmenu: 'backup',
                estado: '1',
            },
            {
                idSubmenu: 8,
                nombreSubmenu: 'Matriz Riesgo',
                rutaSubmenu: '/pages/main/configuracion/matrizRiesgo',
                iconoSubmenu: 'backup',
                estado: '1',
            },
            {
                idSubmenu: 9,
                nombreSubmenu: 'Responsable',
                rutaSubmenu: '/pages/main/configuracion/responsable',
                iconoSubmenu: 'backup',
                estado: '1',
            },
            {
                idSubmenu: 10,
                nombreSubmenu: 'Riesgo Contol',
                rutaSubmenu: '/pages/main/configuracion/riesgoControl',
                iconoSubmenu: 'backup',
                estado: '1',
            },
            {
                idSubmenu: 11,
                nombreSubmenu: 'Encuesta',
                rutaSubmenu: '/pages/main/configuracion/encuesta',
                iconoSubmenu: 'backup',
                estado: '1',
            }

            // {
            //     idSubmenu: 4,
            //     nombreSubmenu: 'Principio',
            //     rutaSubmenu: '/pages/main/configuracion/principio',
            //     iconoSubmenu: 'backup',
            //     estado: '1',
            // },
            // {
            //     idSubmenu: 5,
            //     nombreSubmenu: 'Metodologia',
            //     rutaSubmenu: '/pages/main/configuracion/metodologia',
            //     iconoSubmenu: 'backup',
            //     estado: '1',
            // },
            // {
            //     idSubmenu: 6,
            //     nombreSubmenu: 'Pregunta',
            //     rutaSubmenu: '/pages/main/configuracion/pregunta',
            //     iconoSubmenu: 'backup',
            //     estado: '1',
            // }
            // ,
            // {
            //     idSubmenu: 7,
            //     nombreSubmenu: 'Clase',
            //     rutaSubmenu: '/pages/main/configuracion/clase',
            //     iconoSubmenu: 'backup',
            //     estado: '1',
            // }
            // ,
            // {
            //     idSubmenu: 8,
            //     nombreSubmenu: 'Sistema por Clase',
            //     rutaSubmenu: '/pages/main/configuracion/asignacionclase',
            //     iconoSubmenu: 'backup',
            //     estado: '1',
            // }
            // ,
            // {
            //     idSubmenu: 8,
            //     nombreSubmenu: 'Asignar Clase - Detalle',
            //     rutaSubmenu: '/pages/main/configuracion/asignacionclasedetalle',
            //     iconoSubmenu: 'backup',
            //     estado: '1',
            // }
        ]
    }
    // ,
    // {
    //     idMenu: 2,
    //     nombreMenu: 'Encuesta',
    //     rutaMenu: '_/app/componente',
    //     iconoMenu: 'bookmark_border',
    //     estado: '1',
    //     listaSubmenu: [
    //         {
    //             idSubmenu: 1,
    //             nombreSubmenu: 'Componentes',
    //             rutaSubmenu: '../app/componente/seccion',
    //             iconoSubmenu: 'backup',
    //             estado: '1',
    //         },
    //         {
    //             idSubmenu: 2,
    //             nombreSubmenu: 'Componentes 2',
    //             rutaSubmenu: '../app/componente/seccion',
    //             iconoSubmenu: 'backup',
    //             estado: '1',
    //         }
    //     ]
    // },
    // {
    //     idMenu: 3,
    //     nombreMenu: 'Otros',
    //     rutaMenu: '_/app/componente',
    //     iconoMenu: 'perm_media',
    //     estado: '1',
    //     listaSubmenu: []
    // }
];
