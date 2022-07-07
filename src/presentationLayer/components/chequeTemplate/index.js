import React from 'react';
import {Grid, Paper, Typography, Divider} from '@material-ui/core';


/**
 * @deprecated
 * use ../button.js
 */
class ChequeTemplate extends React.Component {
    
    renderSection(section) {
        if (!section) return undefined;

        let content;
        
        if (section.text && section.icon) {
            let type = section.type || 'top';
            
            switch(type.toLowerCase()) {
                case 'top':
                    content = (
                        <Grid container direction='column' justify='center'>
                            <Grid container justify='center'>
                                {section.icon}
                            </Grid>
                            <Grid item>
                                <Typography variant='h4' align='center' style={{color: '#555', fontSize: 14, marginTop: 5, whiteSpace: 'pre-line', overflow: 'hidden'}}>{section.text}</Typography>
                            </Grid>                            
                        </Grid>
                    )
                    break
                case 'right':
                    content = (
                        <Grid container direction='row' justify='center'>
                            <Typography variant='h4' align='center' style={{color: '#555', fontSize: 14, marginRight: 10, whiteSpace: 'pre-line', overflow: 'hidden'}}>{section.text}</Typography>
                            {section.icon}
                        </Grid>
                    )
                    break
                case 'bottom':
                    content = (
                        <Grid container direction='column'>
                            
                            <Grid item>
                                <Typography variant='h4' align='center' style={{color: '#555', fontSize: 14, marginBottom: 5, whiteSpace: 'pre-line', overflow: 'hidden'}}>{section.text}</Typography>
                            </Grid>   
                            <Grid container justify='center'>
                                {section.icon}
                            </Grid>                            
                        </Grid>
                    )
                    break
                case 'left':
                    content = (
                        <Grid container direction='row' justify='center'>
                            {section.icon}
                            <Typography variant='h4' align='center' style={{color: '#555', fontSize: 14, marginLeft: 8, whiteSpace: 'pre-line', overflow: 'hidden'}}>{section.text}</Typography>
                        </Grid>
                    )
                    break
                default: 
                    break
            }            
        } else if (section.text) {
            content = (
                <Grid container direction='row' justify='center'>
                    <Typography variant='h4' align='center' style={{color: '#555', fontSize: 14, marginLeft: 8, whiteSpace: 'pre-line', overflow: 'hidden'}}>
                        { section.text }
                    </Typography>
                </Grid>
            )
        } else {
            content = (
                <Grid container direction='row' justify='center'>
                    {section.icon}                    
                </Grid>
            )
        }
        return (
            <Grid container justify='center' style={{marginTop: 10}}>
                {content}
            </Grid>
        )
    }

    render() {
        let header = this.renderSection(this.props.header)
        let footer = this.renderSection(this.props.footer)
        return (
            <Grid container style={{
                minWidth: 320
            }}>
                <Paper style={{width: '100%', padding: 20}}>
                    {this.props.header && header}
                    <Grid container justify='center' style={{marginTop: 15, marginBottom: 15}} direction='column'>
                        <Grid container justify='center'>
                            <Typography variant='h4' style={{fontSize: 15, fontWeight: 'bold', color: '#555'}}>Название компании</Typography>
                        </Grid>
                        <Grid container justify='center'>                            
                            <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>Название филиала</Typography>
                        </Grid>
                        <Grid container justify='center'>                            
                            <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>Адрес филиала</Typography>
                        </Grid>
                        
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>Дата регистрации</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                    
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>01.01.2019</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>ИНН</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                                                        
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>3123123213123</Typography>
                                </Grid>                            
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>Рег №</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                    
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>1000000</Typography>                                    
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>ЗН ККМ</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                                                        
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>Р0000000</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>Кассир</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                                                        
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>Фамилия Имя</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>Чек №</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                                                    
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>100</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>Смена</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                                                                                        
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>2</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider light style={{marginTop: 10}}/>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>ИТОГО:</Typography>
                        </Grid>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>ИТОГО К ОПЛАТЕ:</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                                                                                        
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>100000 сум</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>ОПЛАЧЕНО</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                                                                                        
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>100000 сум</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>Наличные</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                                                                                        
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>100000 сум</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>Итого сумма НДС</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                                                                                        
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>0 сум</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider light style={{marginTop: 10}} />
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>ИТОГО</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                                                                                        
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>10000 сум</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>ФН №</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                                                                                        
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>1004234234234234</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>ФД №</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                                                                                        
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>11</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={7}>
                                <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>ФПД №</Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify='flex-end'>                                                                                                        
                                    <Typography variant='h4' style={{fontSize: 14, color: '#999', marginTop: 10}}>42423424</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {this.props.footer && footer}
                </Paper>
            </Grid>
        )
    }

}

export default ChequeTemplate;