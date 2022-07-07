import React, {useRef, useState} from 'react';
import {Grid, Stepper, Step, StepLabel, Button} from '@material-ui/core';
import AddCompany from './company/addCompany';
import AddBranch from './addBranch';
import AddEmployee from './addEmployee';
import {useSelector} from 'react-redux';
import SetCategory from './setCategory';

const stepList = ['Информация о компании', 'Филиал', 'Сотрудники', 'Каталог Товаров'];

const Config = () => {

    const [step, setStep] = useState(0)
    const contentRef = useRef()

    const isLoading = useSelector(state => state.get('config').isLoading);

    const getContent = () => {
        switch(step) {
            case 0:
                return <AddCompany ref={contentRef} navigateToNext={goNext}/>;
            case 1:
                return <AddBranch />;
            case 2:
                return <AddEmployee />;
            case 3:
                return <SetCategory ref={contentRef} />;
            default:
                return false
        }
    }

    const goNext = () => {
        setStep(step + 1)
    }

    return (
        <Grid container style={{height: '100%'}}>
            <Grid container style={{width: '100%', height: 100}} justify="center">
                <Grid item>
                    <Stepper style={{flexGrow: 1}} alternativeLabel activeStep={step}>
                        {stepList.map((label, index) => (
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>

            </Grid>
            <Grid container style={{
                height: 'calc(100% - 110px - 40px)',
                overflow: 'auto',
                color: '#555'
            }}> { getContent() } </Grid>

            <Grid container justify='center' alignItems="center" direction="row" style={{ height: 40, marginBottom: 10 }}>
                <Grid item>
                    {
                        step === 0 ? (
                            <div style={{flexGrow: 1, justifyContent: 'center'}}>
                                <Button
                                    fullWidth
                                    color='primary'
                                    onClick={() => { contentRef.current && contentRef.current.clearForm() }}
                                    variant='text'>ОЧИСТИТЬ</Button>
                            </div>
                        ) : undefined
                    }
                </Grid>
                <Grid item>
                    <Button
                        disabled={isLoading}
                        fullWidth color='primary' variant='text' onClick={() => {
                        if (step === 0)
                            contentRef.current && contentRef.current.verify()
                        else if (step !== 3) {
                            setStep(step + 1)
                        } else {
                            contentRef.current && contentRef.current.saveCategoryList()
                        }
                    }}>ПРОДОЛЖИТЬ</Button>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Config;
