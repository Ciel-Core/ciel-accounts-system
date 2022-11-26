/**
 * 
 * Collect all the "normal" custom <element> components in one file
 * 
 **/

import generalStyles from './../styles/general.module.css';
import { processProps } from './_custom';;

import { Link } from './Link.jsx';
import { Button } from './Button.jsx';
import { Input, setInputState } from './Input.jsx';
import { Select } from './Select.jsx';
import { Notice } from './Notice.jsx';
import { Mark } from './Mark.jsx';
import { FlexContainer } from './FlexContainer.jsx';
import { CheckBox } from './CheckBox.jsx';
import { Radio, getRadioValueByNameGroup, onRadioGroupChange } from './Radio.jsx';
import { Dialog, setDialogState, showDialog } from './Dialog.jsx';
import { SearchBox } from './SearchBox.jsx';
import { UserMessage } from './UserMessage.jsx';
import { LoadingSpinner } from './LoadingSpinner.jsx';

export function Divider(props){
    let basicProps = processProps(props, generalStyles.divider);
    return <hr class={basicProps.class} style={basicProps.style}/>
}

export {
    Input,
    setInputState,

    Dialog,
    setDialogState,
    showDialog,

    Radio,
    getRadioValueByNameGroup,
    onRadioGroupChange,

    Link,
    Button,
    Select,
    Notice,
    Mark,
    FlexContainer,
    CheckBox,
    SearchBox,
    UserMessage,
    LoadingSpinner
};