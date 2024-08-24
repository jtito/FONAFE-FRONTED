import {PrimeNGConfig} from 'primeng/api';

export class IdiomaEsp {
    static idiomaEsp(config: PrimeNGConfig): PrimeNGConfig {
        config.setTranslation({
            apply: 'Aplicar',
            clear: 'Limpiar',
            today: 'Hoy',
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            dayNamesShort: ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'],
            dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic']

        });
        return config;
    }
}
