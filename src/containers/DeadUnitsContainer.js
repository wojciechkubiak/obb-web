import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import GeneratePDFButton from "./../components/Buttons/GeneratePDFButton";
import Head from "./../components/Table/Head";
import Body from "./../components/Table/Body";
import Menu from "./../components/Menu/Menu";
import shortid from "shortid";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DeadUnitsContainer = props => {
  const [data, setData] = useState([]);
  const [unlimitedData, setUnlimitedData] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [idPig, setIdPig] = useState("");

  const getData = () => {
    fetch(`https://obb-api.herokuapp.com/dead-pigs-limited`)
      .then(res => res.json())
      .then(res => setData(res))
      .catch(e => e);
  };

  const getUnlimitedData = () => {
    fetch(`https://obb-api.herokuapp.com/dead-pigs`)
      .then(res => res.json())
      .then(res => setUnlimitedData(res))
      .catch(e => e);
  };

  useEffect(() => {
    getData();
    getUnlimitedData();
  }, [props.isOn]);

  const showForm = id => {
    setIdPig(id);
    toggleMenu();
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date();

    doc.text(`${props.mode} - ${date.toString().substring(0, 15)}`, 10, 20);
    doc.autoTable({
      startY: 25,
      head: [["Data zgonu", "Kojec", "ID", "Plec", "Data zakupu", "Cena"]],
      body: unlimitedData.map(data => [
        `${data.pigDeathDate.substring(0, 10)}`,
        `${data.idPen}`,
        `${data.id}`,
        `${data.pigGender === "m" ? "Samiec" : "Samica"}`,
        `${data.pigShoppingDate.substring(0, 10)}`,
        `${data.pigShoppingPrice}`
      ])
    });

    doc.save("dead-units.pdf");
  };

  return (
    <div className="UnitsContainer">
      <div className="UnitsTable">
        <div className="TableContent">
          <Table bordered hover variant="dark">
            <thead>
              <Head
                data={[
                  "Kojec",
                  "ID",
                  "Płeć",
                  "Data zakupu",
                  "Cena",
                  "Data zgonu"
                ]}
              />
            </thead>
            <tbody>
              {data.map((data, index) => (
                <Body
                  key={`${data.id}${shortid.generate()}`}
                  data={data}
                  showForm={showForm.bind(this, data.id)}
                />
              ))}
            </tbody>
          </Table>
        </div>
        <GeneratePDFButton generatePDFHandler={generatePDF} />
        {showMenu && (
          <Menu
            mode="dead"
            id={idPig}
            showMenu={toggleMenu}
            reloadHandler={props.reloadHandler}
          />
        )}
      </div>
    </div>
  );
};

export default DeadUnitsContainer;
