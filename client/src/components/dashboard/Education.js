import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import {deleteEducation} from '../../actions/profile'
import { connect } from 'react-redux';

const Education = ({education, deleteEducation}) => {

    const educations = education.map(ed =>(
        <tr key={ed._id}>
            <td >{ed.school}</td>
            <td className="hide-sm">{ed.degree}</td>
            <td className="hide-sm">
                <Moment format="DD/MM/YYYY" >{ed.from}</Moment> - {ed.to!==null? (<Moment format="DD/MM/YYYY">{ed.to}</Moment>): (' Now')}
            </td>
            <td>
                <button onClick={() => deleteEducation(ed._id)} className="btn btn-danger">Delete</button>
            </td>
        </tr>
    ))

    return(
        <Fragment>
            <h2 className="my-2">Education</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>School</th>
                        <th className="hide-sm">Degree</th>
                        <th className="hide-sm">Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {educations}
                </tbody>
            </table>
        </Fragment>
    )
    
}
Education.propTypes = {
    education: PropTypes.object.isRequired,
    deleteEducation: PropTypes.func.isRequired
}

export default connect(null, {deleteEducation}) (Education)