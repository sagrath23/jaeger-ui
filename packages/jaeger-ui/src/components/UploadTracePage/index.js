import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as jaegerApiActions from '../../actions/jaeger-api';

type UploadTraceProps = {
    saveUploadedTrace: File => void,
};

type UploadTraceState = {
    content: File,
    uploaded: boolean,
};

export default class UploadTracePage extends React.PureComponent<UploadTraceProps, UploadTraceState> {
    constructor(props: UploadTraceProps) {
        super(props);
        this.state = {
            uploaded: false,
            content: null,
        };
    }

    traceFileUploaded(event) {
        const onReaderLoad = newEvent => {
            const obj = JSON.parse(newEvent.target.result);
            this.setState({uploaded: true, content: obj});
        };
        
        const reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }
    
    uploadFile(event) {
        event.preventDefault();
        const { saveUploadedTrace } = this.props;
        if(saveUploadedTrace){

            saveUploadedTrace(this.state.content);
        }
        this.setState({uploaded: true});
    }

    render() {
        return (
        <form>
            <input type="file" id="spansFile" onChange={event => {this.traceFileUploaded(event)}}/>
            <button onClick={event => {this.uploadFile(event)}}>Upload</button>
        </form>);
    }
}

export function mapStateToProps(state: { archive: TracesArchive, config: Config, trace: { loading: boolean, traces: { [string]: Trace } } }, ownProps: { match: Match }) {
    const archiveEnabled = Boolean(state.config.archiveEnabled);
    return { archiveEnabled, loading: state.trace.loading };
}

export function mapDispatchToProps(dispatch: Function) {
    const { saveUploadedTrace } = bindActionCreators(jaegerApiActions, dispatch);
    return { saveUploadedTrace };
}

export const UploadTrace = connect(mapStateToProps,mapDispatchToProps)(UploadTracePage);