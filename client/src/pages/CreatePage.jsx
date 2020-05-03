import React, { useState, useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useContext } from 'react';
import {useHistory} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CreatePage = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [link, setLink] = useState('');
  const {request} = useHttp();
  useEffect(() => {
    window.M.updateTextFields();
  }, [])
  const pressHandler = async e => {
    if(e.key === 'Enter') {
      try {
        const data = await request('/api/link/generate', 'POST', {from: link}, {
          Authorization: `Bearer ${auth.token}`
        })
        history.push(`/detail/${data.link._id}`)
      } catch(e) {

      }
    }
  }
  return (
    <div className="row">
      <div className="col s8 offset-s2" style={{ paddingTop: '2rem' }}>
        <div className="input-field">
          <input
            placeholder="Put your link here"
            id="link"
            name="link"
            type="text"
            value={link}
            onChange={e => setLink(e.target.value)}
            onKeyPress={pressHandler} />
          <label htmlFor="link">Your link</label>
        </div>
      </div>
    </div>
  )
}

export default CreatePage;