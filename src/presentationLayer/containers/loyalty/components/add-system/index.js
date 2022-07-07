import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid, IconButton,
  InputLabel,
  MenuItem,
  Select, TextField,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import {
  getLoyaltySystemDetails,
  resetLoyaltySystemDetails,
  getLoyaltyPeriods,
  getLoyaltySystemStatuses,
  getLoyaltyCardTypes,
  getAddLoyaltySystemCards,
  getAddLoyaltySystemBranches,
  addLoyaltySystem,
  resetAddLoyaltySystem,
  updateLoyaltySystem,
  resetUpdateLoyaltySystem,
} from "../../redux/actions";
import "./styles.scss";
import withNotification from "../../../../hocs/withNotification/WithNotification";
import SelectBox from "../../../../components/Select";
import NumberTextField from "../../../../components/Textfields/NumberTextField";
import { ArrowBackIos } from "@material-ui/icons";
import { cardTypesCodes } from "../../redux/constants";

class Rule {
  constructor() {
    this.errors = {};
  }
}

const compareCards = (type) => {
  if (type === cardTypesCodes.CREDIT) {
    return (a, b) => {
      if (a.creditAmount > b.creditAmount) {
        return 1;
      }
      if (a.creditAmount < b.creditAmount) {
        return -1;
      }

      return 0;
    }
  }

  return (a, b) => {
    if (a.percent > b.percent) {
      return 1;
    }
    if (a.percent < b.percent) {
      return -1;
    }

    return 0;
  }
};

export default withNotification((props) => {
  const { match, history } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const systemId = match.params.id;
  const [rules, setRules] = useState({});
  const [showDowngrade, setShowDowngrade] = useState(false);

  const $loyaltySystemDetails = useSelector(state => state.get('loyalty').loyaltySystemDetails);
  const $loyaltyCardTypes = useSelector(state => state.get("loyalty").loyaltyCardTypes);
  const $loyaltyCards = useSelector(state => state.get("loyalty").addLoyaltySystemCards);
  const $loyaltySystemStatuses = useSelector(state => state.get("loyalty").loyaltySystemStatuses);
  const $branches = useSelector(state => state.get("loyalty").addLoyaltySystemBranches);
  const $loyaltyPeriods = useSelector(state => state.get("loyalty").loyaltyPeriods);
  const $addLoyaltySystem = useSelector(state => state.get("loyalty").addLoyaltySystem);
  const $updateLoyaltySystem = useSelector(state => state.get("loyalty").updateLoyaltySystem);

  const [selectBranches, setSelectBranches] = useState([]);
  const [selectCards, setSelectCards] = useState([]);

  const [formFields, setFormFields] = useState({ selectedCards: [] });
  const [fieldsErrors, setFieldsErrors] = useState({});

  const loyaltySystemDetails = $loyaltySystemDetails.data;

  console.log("formFields", formFields);

  useEffect(() => {
    if (systemId) {
      dispatch(getLoyaltySystemDetails(systemId));
    }
    if (!$loyaltyCardTypes.data.length) {
      dispatch(getLoyaltyCardTypes());
    }
    if (!$loyaltyPeriods.data.length) {
      dispatch(getLoyaltyPeriods());
    }

    if (!$loyaltySystemStatuses.data.length) {
      dispatch(getLoyaltySystemStatuses());
    }

    return () => {
      dispatch(resetLoyaltySystemDetails());
    }
  }, []);

  useEffect(() => {
    if (loyaltySystemDetails) {
      dispatch(getAddLoyaltySystemCards({ type: loyaltySystemDetails.cardType.code }));
      dispatch(getAddLoyaltySystemBranches({ type: loyaltySystemDetails.cardType.code }));

      setFormFields({
        branchIds: loyaltySystemDetails.branches.map((item) => item.id),
        name: loyaltySystemDetails.name,
        cardType: loyaltySystemDetails.cardType.code,
        status: loyaltySystemDetails.status.code,
        selectedCards: loyaltySystemDetails.rules.map((item) => item.cardDTO.id),
      });

      const rulesData = loyaltySystemDetails.rules.reduce((acc, item) => {
        return {
          ...acc,
          [item.cardDTO.id]: {
            upgradePeriodId: item.upgradePeriod.id,
            upgradeAmount: item.upgradeAmount,
            downgradePeriodId: item.downgradePeriod && item.downgradePeriod.id,
            downgradeAmount: item.downgradeAmount,
            errors: {}
          }
        }
      }, {});
      setRules(rulesData);
    }
  }, [loyaltySystemDetails]);

  useEffect(() => {
    if (loyaltySystemDetails) {
      setSelectBranches([...$branches.data, ...loyaltySystemDetails.branches ]);
      const cards = [...$loyaltyCards.data, ...loyaltySystemDetails.rules.map((item) => item.cardDTO)];
      cards.sort(compareCards(loyaltySystemDetails.cardType.code));
      setSelectCards(cards);
    } else {
      setSelectBranches($branches.data);
      setSelectCards($loyaltyCards.data);
    }
  }, [loyaltySystemDetails, $branches.data, $loyaltyCards.data]);

  useEffect(() => {
    if ($addLoyaltySystem.success) {
      props.success(t("loyalty.addSystemSuccess"));

      dispatch(resetAddLoyaltySystem());
      history.push("/main/loyalty/systems");
    }
  }, [$addLoyaltySystem.success]);


  useEffect(() => {
    if ($updateLoyaltySystem.success) {
      dispatch(getLoyaltySystemDetails(systemId));
      dispatch(resetUpdateLoyaltySystem());
      props.success(t("loyalty.updateSystemSuccess"));
    }
  }, [$updateLoyaltySystem.success]);

  const onFormFieldChange = (fields) => {
    setFormFields({ ...formFields, ...fields });
  };

  const onCardTypeChange = (cardType) => {
    onFormFieldChange({ cardType, selectedCards: [] });
    dispatch(getAddLoyaltySystemCards({ type: cardType }));
    dispatch(getAddLoyaltySystemBranches({ type: cardType }));
  };

  const onSelectedCardsChange = (selectedCards) => {
    onFormFieldChange({ selectedCards });

    const newRules = {};
    selectedCards.forEach((id) => {
      if (rules[id]) {
        newRules[id] = rules[id];
      } else {
        newRules[id] = new Rule();
      }
    });

    if (Object.keys(newRules).length) {
      setRules(newRules);
    }
  };

  const onRuleFieldChange = (cardId, fields) => {
    console.log("onRuleFieldChange", cardId, fields);

    const rule = rules[cardId];
    // const errors = updateErrors(condition.errors, fields);

    const updatedRule = { ...rule, ...fields };

    setRules({ ...rules, [cardId]: updatedRule });
  };

  const rulesValidation = () => {
    let rulesErrors = {};
    const notFilledMessage = t("common.notFilledMessage");

    const rulesClone = { ...rules };
    formFields.selectedCards.forEach((id) => {
      const rule = rules[id] || {};
      const errors = {};

      if (!rule.upgradePeriodId) errors.upgradePeriodId = notFilledMessage;
      if (!rule.upgradeAmount) errors.upgradeAmount = notFilledMessage;
      // if (!rule.downgradePeriodId) errors.downgradePeriodId = notFilledMessage;
      // if (!rule.downgradeAmount) errors.downgradeAmount = notFilledMessage;

      rulesErrors = { ...rulesErrors, ...errors };
      rulesClone[id] = { ...rule, errors };
      return { ...rule, errors }
    });
    setRules(rulesClone);

    return rulesErrors;
  };

  const onSubmit = () => {
    const notFilledMessage = t("common.notFilledMessage");
    const mainErrors = {};

    if (!formFields.branchIds || !formFields.branchIds.length) mainErrors.branchIds = notFilledMessage;
    if (!formFields.cardType) mainErrors.cardType = notFilledMessage;
    if (!formFields.name) mainErrors.name = notFilledMessage;
    if (!formFields.selectedCards.length) mainErrors.selectedCards = notFilledMessage;

    setFieldsErrors(mainErrors);

    const rulesErrors = rulesValidation();

    if (Object.keys(mainErrors).length || Object.keys(rulesErrors).length) {
      return;
    }

    const rulesData = Object.keys(rules).map((cardId) => ({
      loyalCardId: cardId,
      upgradePeriodId: rules[cardId].upgradePeriodId,
      upgradeAmount: rules[cardId].upgradeAmount,
      downgradePeriodId: rules[cardId].downgradePeriodId,
      downgradeAmount: rules[cardId].downgradeAmount,
    }));

    const data = {
      branchIds: formFields.branchIds,
      cardType: formFields.cardType,
      name: formFields.name,
      rules: rulesData
    };

    if (systemId) {
      data.id = systemId;
      data.status = formFields.status;
      dispatch(updateLoyaltySystem(data));
    } else {
      dispatch(addLoyaltySystem(data));
    }
  };

  return (
    <div className="custom-content loyaltySys">
      <div className="custom-content__header">
        <div className="custom-content__header__left">
          <IconButton
            color="primary"
            onClick={() => {
              props.history.goBack();
            }}
          >
            <ArrowBackIos />
          </IconButton>
          <div className="custom-content__header__left-inner">
            <h1>
              {systemId ?
                loyaltySystemDetails ? loyaltySystemDetails.name : ""
                : t("loyalty.addSystem")}
            </h1>
          </div>
        </div>
      </div>
      <div className="loyaltySys__submit">
        <Button onClick={onSubmit} color="primary" variant="contained">
          {systemId ? t("loyalty.save") : t("loyalty.add")}
        </Button>
      </div>
      <div className="loyaltySys__main-form">
        <div className="loyaltySys__main-form__item">
          <SelectBox
            itemKey="code"
            itemValue="name"
            labelWidth={100}
            label={t("loyalty.addSystemType")}
            data={$loyaltyCardTypes.data.map(item => ({ code: item.code, name: item.nameRu }))}
            onChange={(event) => onCardTypeChange(event.target.value)}
            value={formFields.cardType || ""}
            error={!!fieldsErrors.cardType}
            helperText={fieldsErrors.cardType}
            inputProps={{ readOnly: !!systemId }}
          />
        </div>
        <div className="loyaltySys__main-form__item">
          <FormControl fullWidth variant="outlined" error={!!fieldsErrors.branchIds} disabled={!formFields.cardType}>
            <InputLabel>{t("loyalty.addSystemBranches")}</InputLabel>
            <Select
              multiple
              label={t("loyalty.addSystemBranches")}
              variant="outlined"
              value={formFields.branchIds || []}
              onChange={(event) => onFormFieldChange({ branchIds: event.target.value })}
            >
              {selectBranches.map((item) => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>))}
            </Select>
            {fieldsErrors.branchIds && <FormHelperText>{fieldsErrors.branchIds}</FormHelperText>}
          </FormControl>
        </div>
        <div className="loyaltySys__main-form__item">
          <FormControl fullWidth variant="outlined" error={!!fieldsErrors.selectedCards}
                       disabled={!formFields.cardType}>
            <InputLabel>{t("loyalty.addSystemCards")}</InputLabel>
            <Select
              multiple
              label={t("loyalty.addSystemCards")}
              variant="outlined"
              value={formFields.selectedCards || []}
              onChange={(event) => onSelectedCardsChange(event.target.value)}
            >
              {selectCards.map((item) => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>))}
            </Select>
            {fieldsErrors.selectedCards && <FormHelperText>{fieldsErrors.selectedCards}</FormHelperText>}
          </FormControl>
        </div>
        <div className="loyaltySys__main-form__item">
          <FormControl fullWidth component="fieldset">
            <TextField
              variant="outlined"
              label={t("loyalty.addSystemName")}
              value={formFields.name || ""}
              onChange={(e) => onFormFieldChange({ name: e.target.value })}
              error={!!fieldsErrors.name}
              helperText={fieldsErrors.name}
            />
          </FormControl>
        </div>
        {!!systemId && <div className="loyaltySys__main-form__item">
          <SelectBox
            itemKey="code"
            itemValue="name"
            labelWidth={100}
            label={t("loyalty.addSystemStatus")}
            data={$loyaltySystemStatuses.data.map(item => ({ code: item.code, name: item.name }))}
            onChange={(event) => onFormFieldChange({ status: event.target.value })}
            value={formFields.status || ""}
            error={!!fieldsErrors.status}
            helperText={fieldsErrors.status}
          />
        </div>}
      </div>

      {!!formFields.selectedCards.length && (
        <>
          <div className="loyaltySys__downgrade">
            <FormControlLabel
              control={<Checkbox color="primary" checked={showDowngrade} onChange={() => setShowDowngrade(!showDowngrade)} />}
              label={t("loyalty.addSystemShowDowngrade")}
            />
          </div>
          <div className="loyaltySys__rules">
            <div className="loyaltySys__rules__row trHead">
              <div className="loyaltySys__rules__cell cell-name">{t("loyalty.addSystemRuleName")}</div>
              <div className="loyaltySys__rules__cell cell-bonus">{t("loyalty.addSystemRulePercent")}</div>
              <div className="loyaltySys__rules__cell cell-min-amount">{t("loyalty.addSystemRuleMinAmount")}</div>
              <div className="loyaltySys__rules__cell cell-field">{t("loyalty.addSystemRuleUpgradePeriod")}</div>
              <div className="loyaltySys__rules__cell cell-field">{t("loyalty.addSystemRuleUpgradeAmount")}</div>
              {showDowngrade && <>
                <div className="loyaltySys__rules__cell cell-field">{t("loyalty.addSystemRuleDowngradePeriod")}</div>
                <div className="loyaltySys__rules__cell cell-field">{t("loyalty.addSystemRuleDowngradeAmount")}</div>
              </>}
            </div>
            {selectCards.filter((card) => !!rules[card.id]).map((card, index) => {
              const rule = rules[card.id];

              return (
                <div key={card.id} className="loyaltySys__rules__item">
                  <div className="loyaltySys__rules__desc">
                    {index + 1} {index === 0 ? t("loyalty.addSystemRuleDesc1") : t("loyalty.addSystemRuleDesc2")}
                  </div>
                  <div className="loyaltySys__rules__row">
                    <div className="loyaltySys__rules__cell cell-name">{card.name}</div>
                    <div className="loyaltySys__rules__cell cell-bonus">
                      {formFields.cardType === cardTypesCodes.CREDIT ? card.creditAmount.toLocaleString(): card.percent+"%"}
                    </div>
                    <div className="loyaltySys__rules__cell cell-min-amount">{card.minAmount.toLocaleString()}</div>
                    <div className="loyaltySys__rules__cell cell-field">
                      <SelectBox
                        itemKey="id"
                        itemValue="name"
                        labelWidth={60}
                        label={t("loyalty.addSystemRulePeriod")}
                        data={$loyaltyPeriods.data.map(item => ({ id: item.id, name: item.name }))}
                        onChange={(e) => {
                          onRuleFieldChange(card.id, { upgradePeriodId: e.target.value })
                        }}
                        value={rule.upgradePeriodId}
                        error={!!rule.errors.upgradePeriodId}
                        helperText={rule.errors.upgradePeriodId}
                      />
                    </div>
                    <div className="loyaltySys__rules__cell cell-field">
                      <FormControl fullWidth variant='outlined'>
                        <NumberTextField
                          variant="outlined"
                          label={t("loyalty.addSystemRuleAmount")}
                          value={rule.upgradeAmount}
                          onChange={(e) => {
                            onRuleFieldChange(card.id, { upgradeAmount: e.target.value })
                          }}
                          error={!!rule.errors.upgradeAmount}
                          helperText={rule.errors.upgradeAmount}
                        />
                      </FormControl>
                    </div>
                    {showDowngrade && <>
                      <div className="loyaltySys__rules__cell cell-field">
                        <SelectBox
                          itemKey="id"
                          itemValue="name"
                          labelWidth={60}
                          label={t("loyalty.addSystemRulePeriod")}
                          data={$loyaltyPeriods.data.map(item => ({ id: item.id, name: item.name }))}
                          onChange={(event) => {
                            onRuleFieldChange(card.id, { downgradePeriodId: event.target.value })
                          }}
                          value={rule.downgradePeriodId}
                          error={!!rule.errors.downgradePeriodId}
                          helperText={rule.errors.downgradePeriodId}
                        />
                      </div>
                      <div className="loyaltySys__rules__cell cell-field">
                        <FormControl fullWidth variant='outlined'>
                          <NumberTextField
                            variant="outlined"
                            label={t("loyalty.addSystemRuleAmount")}
                            value={rule.downgradeAmount}
                            onChange={(e) => {
                              onRuleFieldChange(card.id, { downgradeAmount: e.target.value })
                            }}
                            error={!!rule.errors.downgradeAmount}
                            helperText={rule.errors.downgradeAmount}
                          />
                        </FormControl>
                      </div>
                    </>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {($addLoyaltySystem.loading || $updateLoyaltySystem.loading) && <div className="abs-loader">
        <CircularProgress color="primary" />
      </div>}
    </div>
  )
});
