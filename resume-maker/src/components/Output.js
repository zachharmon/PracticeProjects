import React from 'react';
import ReactPDF, { Page, Text, View, Document, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';
import TimesNewRoman from '../fonts/TimesNewRoman.ttf';
import TimesNewRomanBold from '../fonts/TimesNewRomanBold.ttf';
import TimesNewRomanItalic from '../fonts/TimesNewRomanItalic.ttf';

const fontSize = Math.max(new URLSearchParams(window.location.search).get('fontSizeIncrease'), -7);

function Output() {

    const resume =  localStorage.getItem('resume') ? JSON.parse(localStorage.getItem('resume')) : null;

    if(!resume) {
        window.close();
        return;
    }

    document.title = resume.name ? resume.name + "'s Resume" : "Resume";


    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <PDFViewer style={{width: '100%', height: '100vh', border: "none"}}>
                {ResumeDocument(resume)}
            </PDFViewer>
        </div>
    );
}

const ResumeDocument = (resume) => {

    let contacts = [];
    if(resume.email) contacts.push(resume.email);
    if(resume.phone) contacts.push(resume.phone);
    if(resume.website) contacts.push(resume.website);

    console.log(resume);

    return(
        <Document>
            <Page size="A4" style={styles.page} orientation="portrait">

                <View style={styles.spacer}></View>

                <Text style={styles.title}>{resume.name}</Text>

                <View style={styles.lineBreak}></View>

                <Text style={styles.contacts}>
                    {contacts.join('   •   ')}
                </Text>

                {
                    resume.education.length > 0 && (
                        <>
                        <Text style={styles.sectionHeader}>Education</Text>

                        {resume.education.map((education, index) => {

                            if(index != resume.education.length - 1) {
                                return(
                                    <>
                                    <Education key={index} {...education} />
                                    <View style={styles.spacer}></View>
                                    </>
                                )
                            }

                            return(
                                <Education key={index} {...education} />
                            )
                            
                        })}
                        </>
                    )
                }

                {
                    resume.experience.length > 0 && (
                        <>
                        <Text style={styles.sectionHeader}>Experience</Text>

                        {resume.experience.map((experience, index) => {

                            if(index < resume.experience.length) {
                                return(
                                    <>
                                    <Experience key={index} {...experience} />
                                    <View style={styles.spacer}></View>
                                    </>
                                )
                            }

                            return(
                                <Experience key={index} {...experience} />
                            )
                            
                        })}
                        </>
                    )
                }

                {
                    resume.activities.length > 0 && (
                        <>
                        <Text style={styles.sectionHeader}>Leadership & Activities</Text>

                        {resume.activities.map((activity, index) => {

                            if(index != resume.activities.length - 1) {
                                return(
                                    <>
                                    <Activity key={index} {...activity} />
                                    <View style={styles.spacer}></View>
                                    </>
                                )
                            }

                            return(
                                <Activity key={index} {...activity} />
                            )
                            
                        })}
                        </>
                    )
                }

                {
                    resume.awards.length > 0 && (
                        <>
                        <Text style={styles.sectionHeader}>Awards & Honors</Text>
                        <View style={styles.centeredBlock}>
                        {resume.awards.map((award, index) => (
                            <View key={index} style={styles.indented}>
                                <Text style={styles.pointInfo}>•   {award.award} ({award.date})</Text>
                            </View>
                        ))}
                        </View>
                        </>
                    )
                }

                {
                    resume.skills.length > 0 && (
                        <>
                        <Text style={styles.sectionHeader}>Skills</Text>

                        <View style={styles.centered}>
                                <Text style={styles.pointInfo}>
                                    {resume.skills.sort((a, b) => a.localeCompare(b)).join(', ')}
                                </Text>
                        </View>
                        </>
                    )
                }
                

            </Page>
        </Document>    
    );
}

const Education = (education) => {
    return(
        <View>
            <View style={styles.opposites}>
                <Text style={styles.sectionPoint}>{education.school}</Text>
                <Text style={styles.pointInfo}>{education.location}</Text>
            </View>
            <View style={styles.opposites}>
                <Text style={styles.pointInfo}>{education.info}</Text>
                <Text style={styles.pointInfo}>{education.start}{education.end?'-':''}{education.end}</Text>
            </View>
            {
                education.courses.length > 0 &&
                <View style={styles.opposites}>
                    <Text style={styles.pointInfo}>{education.courses.length > 0 ?'Relevant Coursework/Details:':''} {education.courses.join(', ')}</Text>
                </View>
            }
            {
                education.projects.length > 0 && (
                    <View style={styles.indented}>
                        <Text style={styles.projectsHeader}>Projects/Works</Text>
                        {education.projects.map((project, index) => (
                            <View key={index} style={styles.flexRow}>
                                <Text style={{...styles.pointInfo}}>{project.class}:</Text>
                                <Text style={{...styles.pointInfo, fontStyle: "italic"}}>{project.project}</Text>
                            </View>
                        ))}
                    </View>
                )
            }
        </View>
    );
}

const Experience = (experience) => {
    return(
        <View>
            <View style={styles.opposites}>
                <Text style={styles.sectionPoint}>{experience.company}</Text>
                <Text style={styles.pointInfo}>{experience.location}</Text>
            </View>
            <View style={styles.opposites}>
                <Text style={styles.pointInfoBold}>{experience.position}</Text>
                <Text style={styles.pointInfo}>{experience.start}-{experience.end}</Text>
            </View>
            {
                <View style={styles.indented}>
                    {experience.description.map((detail, index) => (
                        <View style={styles.flexRow}>
                            <Text key={index} style={styles.pointInfo}>•</Text>
                            <Text key={index} style={styles.pointInfo}>{detail}</Text>
                        </View>
                    ))}
                </View>
            }
        </View>
    );
}

const Activity = (activity) => {
    return (
        <View>
            <View style={styles.opposites}>
                <Text style={styles.sectionPoint}>{activity.activity}</Text>
                <Text style={styles.pointInfo}>{activity.location}</Text>
            </View>

            {
                activity.details.length > 0 && (
                    <View>
                        {activity.details.map((detail, index) => (
                            <View key={index} style={styles.opposites}>
                                <Text style={styles.pointInfo}>{detail.detail}</Text>
                                <Text style={styles.pointInfo}>{detail.start}-{detail.end}</Text>
                            </View>
                        ))}
                    </View>
                )
            }

        </View>
    );
}

Font.register({ family: 'OpenRoman', fonts: [
    { src: TimesNewRoman, fontWeight: 'normal' },
    { src: TimesNewRomanBold, fontWeight: 'bold' },
    { src: TimesNewRomanItalic, fontStyle: 'italic' },
] });

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        paddingBottom: 20,
        fontFamily: "OpenRoman",
    },
    lineBreak: {
        width: "95%",
        marginHorizontal: "auto",
        height: 1,
        backgroundColor: "black",
        marginBottom: 10,
    },
    title: {
        fontSize: 12 + (fontSize ? parseInt(fontSize) : 0),
        marginVertical: 10,
        textAlign: "center",
    },
    contacts: {
        fontSize: 8 + (fontSize ? parseInt(fontSize) : 0),
        textAlign: "center",
    },
    sectionHeader: {
        fontSize: 10 + (fontSize ? parseInt(fontSize) : 0),
        fontWeight: "bold",
        marginVertical: 5,
        marginTop: 20,
        textAlign: "center",
    },
    opposites: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginBottom: 5,
    },
    sectionPoint: {
        fontSize: 10 + (fontSize ? parseInt(fontSize) : 0),
        fontWeight: "bold",
    },
    pointInfo: {
        fontSize: 8 + (fontSize ? parseInt(fontSize) : 0),
    },
    pointInfoBold: {
        fontSize: 8 + (fontSize ? parseInt(fontSize) : 0),
        fontWeight: "bold",
    },
    projectsHeader: {
        fontSize: 8 + (fontSize ? parseInt(fontSize) : 0),
        fontWeight: "bold",
        marginVertical: 5,
    },
    indented: {
        marginHorizontal: 34,
        marginLeft: 40,
    },
    spacer: {
        height: 10,
        //backgroundColor: 'red'
    },
    centered: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
        gap: 10
    },
    centeredBlock: {
        display: "block",
        width: "auto",
        marginHorizontal: "auto",
    }
});

export default Output;