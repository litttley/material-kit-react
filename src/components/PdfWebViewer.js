import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(96, 96, 96, .3)',

    // color: 'white',
    height: '150%',
    padding: '0 30px'
  },
  container: {
    height: '100%'
  },
  pdfReader: {
    height: '100%',
    padding: '0px 0px 0px 0px'
  }
}));

export default function PdfWebViewer(props, refs) {
  const classes = useStyles();
  console.log('PdfWebViewer');
  console.log(props);
  console.log(refs);
  const viewer = useRef();
  console.log(viewer);
  const [refresh, setRefresh] = useState(false);
  /*
  if (viewer.current != null && viewer.current !== undefined && refresh === false) {
    document.getElementsByClassName(viewer.current.className)[0].remove();
    setRefresh(true);
  } */

  const { fileUrl, fileName } = props.docOption;
  const [url, setUrl] = useState(fileUrl);
  const DOCUMENT_ID = fileName;
  /* wesocket用法 
 const DOCUMENT_ID = 'webviewer-demo-1';
  const hostName = window.location.hostname;
  const socketUrl = `ws://${hostName}:3000/ws/`;
  const connection = new WebSocket(socketUrl);
  const serializer = new XMLSerializer();
  connection.onerror = (error) => {
    console.warn(`Error from WebSocket: ${error}`);
  }; */
  useEffect(() => {
    if (refresh === false) {
      WebViewer(
        {
          path: 'http://localhost:9000/webviewer',
          //  initialDoc: fileUrl,
          fullAPI: true,
          documentXFDFRetriever: async () => {
            const rows = await loadxfdfStrings(DOCUMENT_ID);
            return JSON.parse(rows).map((row) => row.xfdfString);
          }
        },
        viewer.current
      ).then((instance) => {
        instance.UI.setLanguage('zh_cn');
        instance.UI.loadDocument(fileUrl, { filename: fileName });
        const { documentViewer, annotationManager } = instance.Core;
        // you can now call WebViewer APIs here...
        documentViewer.addEventListener('documentLoaded', () => {
          // perform document operations
        });
        // later save the annotation data as transaction command for every change
        annotationManager.addEventListener('annotationChanged', (annots, action, options) => {
          // If the event is triggered by importing then it can be ignored
          // This will happen when importing the initial annotations
          // from the server or individual changes from other users
          if (options.imported) return;

          const xfdfString = annotationManager.exportAnnotCommand();

          console.log('xfdfString');
          console.log(xfdfString);

          annotationManager.exportAnnotCommand().then((xfdfStrings) => {
            annots.forEach((annot) => {
              savexfdfString(DOCUMENT_ID, annot.Id, xfdfStrings);
            });
          });

          /* wesocket用法 
         const parser = new DOMParser();
          const commandData = parser.parseFromString(xfdfString, 'text/xml');
          const addedAnnots = commandData.getElementsByTagName('add')[0];
          const modifiedAnnots = commandData.getElementsByTagName('modify')[0];
          const deletedAnnots = commandData.getElementsByTagName('delete')[0];
          // List of added annotations
          addedAnnots.childNodes.forEach((child) => {
            sendAnnotationChange(child, 'add');
          });
          // List of modified annotations
          modifiedAnnots.childNodes.forEach((child) => {
            sendAnnotationChange(child, 'modify');
          });

          // List of deleted annotations
          deletedAnnots.childNodes.forEach((child) => {
            sendAnnotationChange(child, 'delete');
          }); */
        });

        /* wesocket用法   
     connection.onmessage = async (message) => {
          const annotation = JSON.parse(message.data);
          const annotations = await annotationManager.importAnnotCommand(annotation.xfdfString);
          await annotationManager.drawAnnotationsFromList(annotations);
        }; */
      });
      setRefresh(true);
    }

    return () => {
      // 清除订阅
      console.log('565');
      // console.log(viewer.current.innerHTML);
    };
  }, []);

  // Make a POST request with document ID, annotation ID and XFDF string
  const savexfdfString = (documentId, annotationId, xfdfString) => {
    axios
      .post('/annotationAdd', {
        documentId,
        annotationId,
        xfdfString
      })
      .then((response) => {
        console.log(response);
        if (response.data.code === 200) {
          console.log('111');
        } else {
          console.log('222');
        }
      })
      .catch((error) => {});
  };

  // Make a GET request to get XFDF string
  const loadxfdfStrings = (documentId) => {
    axios
      .post('/annotationAdd', {
        documentId
      })
      .then((response) => {
        console.log(response);
        if (response.data.code === 200) {
          console.log('111');
        } else {
          console.log('222');
        }
      })
      .catch((error) => {});
  };

  /*  const loadXfdfStrings = (documentId) => {
    return new Promise((resolve, reject) => {
      fetch(`/server/annotationHandler.js?documentId=${documentId}`, {
        method: 'GET',
      }).then((res) => {
        if (res.status < 400) {
          res.text().then(xfdfStrings => {
            resolve(xfdfStrings);
          });
        } else {
          reject(res);
        }
      });
    });
  }; */

  /* wesocket用法
  // helper function to send annotation changes to WebSocket server
  const sendAnnotationChange = (annotation, action) => {
    if (annotation.nodeType !== annotation.TEXT_NODE) {
      const annotationString = serializer.serializeToString(annotation);
      connection.send(
        JSON.stringify({
          documentId: DOCUMENT_ID,
          annotationId: annotation.getAttribute('name'),
          xfdfString: convertToXfdf(annotationString, action)
        })
      );
    }
  };

  // wrapper function to convert xfdf fragments to full xfdf strings
  const convertToXfdf = (changedAnnotation, action) => {
    let xfdfString = `<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><fields />`;
    if (action === 'add') {
      xfdfString += `<add>${changedAnnotation}</add><modify /><delete />`;
    } else if (action === 'modify') {
      xfdfString += `<add /><modify>${changedAnnotation}</modify><delete />`;
    } else if (action === 'delete') {
      xfdfString += `<add /><modify /><delete>${changedAnnotation}</delete>`;
    }
    xfdfString += `</xfdf>`;
    return xfdfString;
  }; */

  return (
    <>
      <div className={classes.pdfReader} ref={viewer} />
    </>
  );
}
