const valueParser = {
    parseBoolean(value) {
        return {
            type: "boolean",
            name: value.getName(),
            getValue: value.get,
            setValue: value.set
        };
    },
    parseChoose(value) {
        return {
            type: "list",
            name: value.getName(),
            values: value.getChoicesStrings(),
            value: value.get().getChoiceName(),
            setValue: value.setFromValueName
        };
    },
    parseToggleable(value) {
        return {
            type: "togglable",
            name: value.getName(),
            getValue: value.getEnabledValue().get,
            setValue: value.getEnabledValue().set,
            settings: valueParser.parse(value.getContainedSettingsRecursively())
        };
    },
    parseIntRange(value) {
        const range = value.getRange();
        const v = value.get();

        return {
            type: "range",
            name: value.getName(),
            min: range.getStart(),
            max: range.getEndInclusive(),
            step: 1,
            getValue: () => [v.getStart(), v.getEndInclusive()],
            setValue: [
                newValue => {
                    value.set(kotlin.intRange(newValue | 0, v.getEndInclusive()))  
                },
                newValue => {
                    value.set(kotlin.intRange(v.getStart(), newValue | 0));
                }
            ]
        };
    },
    parseInt(value) {
        const range = value.getRange();

        return {
            type: "range",
            name: value.getName(),
            min: range.getStart(),
            max: range.getEndInclusive(),
            step: 1,
            getValue: () => [value.get()],
            setValue: [value.set]
        }
    },
    parseFloat(value) {
        const range = value.getRange();

        return {
            type: "range",
            name: value.getName(),
            min: range.getStart(),
            max: range.getEndInclusive(),
            step: 0.1, // TODO: use real step
            getValue: () => [value.get()],
            setValue: [value.set]
        }
    },
    parseFloatRange(value) {
        const range = value.getRange();
        const v = value.get();

        return {
            type: "range",
            name: value.getName(),
            min: range.getStart(),
            max: range.getEndInclusive(),
            step: 0.1, // TODO: use real step
            getValue: () => [v.getStart(), v.getEndInclusive()],
            setValue: [
                newValue => {
                    value.set(kotlin.intRange(newValue, v.getEndInclusive()))  
                },
                newValue => {
                    value.set(kotlin.intRange(v.getStart(), newValue));
                }
            ]
        };
    },
    parse(values) {
        const parsedValues = [];
        const excludedValues = ["Hidden", "Enabled", "Bind"];

        for (let i = 0; i < values.length; i++) {
            const v = values[i];
            const valueName = v.getName();
            const valueType = v.getValueType().toString();

            if (excludedValues.includes(valueName)) {
                continue;
            }

            let parsed;
            switch (valueType) {
                case "BOOLEAN": {
                    parsed = valueParser.parseBoolean(v);
                    break;
                }
                case "CHOOSE": {
                    parsed = valueParser.parseChoose(v);
                    break;
                }
                case "INT_RANGE": {
                    parsed = valueParser.parseIntRange(v);
                    break;
                }
                case "INT": {
                    parsed = valueParser.parseInt(v);
                    break;
                }
                case "FLOAT": {
                    parsed = valueParser.parseFloat(v);
                    break;
                }
                case "FLOAT_RANGE": {
                    parsed = valueParser.parseFloatRange(v);
                    break;
                }
                case "TOGGLEABLE": {
                    parsed = valueParser.parseToggleable(v);
                    break;
                }
                default: {
                    //console.log(valueType);
                }
            }

            if (parsed) {
                parsedValues.push(parsed);
            }
        }

        return parsedValues;
    }
};