import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as jaegerApiActions from '../../actions/jaeger-api';
import { actions as archiveActions } from '../TracePage/ArchiveNotifier/duck';

type UploadTracePageProps = {};

type UploadTracePageState = {
    file: File,
    uploaded: boolean,
};

export default class UploadTracePage extends React.PureComponent<UploadTracePageProps, UploadTracePageState> {
    props: UploadTracePageProps;
    state: UploadTracePageState;

    constructor(props: UploadTracePageProps) {
        super(props);
        this.state = {
            uploaded: false,
            content: null
        };
        this.uploadTraceFile = this.uploadTraceFile.bind(this);
    }

    uploadTraceFile(event) {
        const onReaderLoad = newEvent => {
            const obj = JSON.parse(newEvent.target.result);
            this.setState({content: obj, uploaded: true});
        };

        const reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
        
        this.setState({uploaded: true});
    }

    sendSpansToCollector(event) {
        event.preventDefault();
        console.log('Sending Spans to Collector');
        if(this.state.uploaded) {
            console.log('spans are uploaded');
        }
    }

    render() {
        return (
        <form>
            <p>Suba su archivo de trazas aquí</p>
            <input type="file" id="file" onChange={event => {this.uploadTraceFile(event)}}/>
            <button onClick={event => {this.sendSpansToCollector(event)}}>Upload Spans</button>
        </form>);
    }
}

export const mapStateToProps = (
    state: { archive: TracesArchive, config: Config, trace: { loading: boolean, traces: { [string]: Trace } } },
    ownProps: { match: Match }) => {
        const { id } = ownProps.match.params;
        const trace = id ? state.trace.traces[id] : null;
        const archiveTraceState = id ? state.archive[id] : null;
        const archiveEnabled = Boolean(state.config.archiveEnabled);
        return { archiveEnabled, archiveTraceState, id, trace, loading: state.trace.loading };
      };

export const mapDispatchToProps = dispatch => {
    const { fetchTrace } = bindActionCreators(jaegerApiActions, dispatch);
    const { archiveTrace, acknowledge: acknowledgeArchive } = bindActionCreators(archiveActions, dispatch);
    return { acknowledgeArchive, archiveTrace, fetchTrace };
  };

export const UploadTraceFilePage = connect(mapStateToProps,mapDispatchToProps)(UploadTracePage);