import React from 'react'
import { Page, Text, View, Document, StyleSheet, renderToStream,  } from '@react-pdf/renderer';
import { LoaderFunction } from '@remix-run/node';
import {Response} from '@remix-run/web-fetch'
// export const loader = async () => {
//     const pdf = () => {
//         return renderToStream(
//             <Document>
//                 <Page>
//                     <Text>Lorem Ipsum</Text>
//                 </Page>
//             </Document>
//         )
//     }
//     const returnpdf = await pdf()
//     return new Response(returnpdf, {

//     })

    


// }

// export default function TiketPdfPage() {
//   return (
//     <Document>

//     </Document>
//   )
// }
