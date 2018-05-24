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
            file: null,
            uploaded: false,
        };
    }
    render() {
        const uploadTraceFile = event => {
            console.log(event, `i'm an event`);
        };
        return (
        <form>
            <p>Suba su archivo de trazas aquí</p>
            <input type="file" id="file" onChange={event => {uploadTraceFile(event)}}/>
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