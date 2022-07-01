import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";

import Page from "../../components/Page";
import ListView from "../../components/ListView";
import Modal from "../../components/Modal";

import api from "../../services/axios";

const endpoint = "/allocations";

const columns = [
    { value: "ID", id: "id" },
    { value: "DayOfWeek", id: "dayOfWeek" },
    { value: "StartHour", id: "startHour" },
    { value: "EndHour", id: "endHour" },
    { 
        value: "Professor", 
        id: "professor", 
        render: (professor) => professor.name,
    },
    { 
        value: "Department", 
        id: "professor", 
        render: (professor) => professor?.department?.name,
    },
    { 
        value: "Course", 
        id: "course", 
        render: (course) => course?.name,
    },
  ];

  const INITIAL_STATE ={
    id:0,
    DayOfWeek:"",
    StartHour: "",
    EndHour:"",
    professor:"",
    department:"",
    course:"",

  };

  const Allocation = () => {
    const [allocation, setAllocation] = useState(INITIAL_STATE);
    const [visible, setVisible] = useState(false);

    const[courses, setCourses] = useState([]);
    const[professors, setProfessors] = useState([]);

    const getInicitalData = async() =>{
        const[responseCourse, responseProfessor] = await Promise.all([
            api.get("/courses"),
            api.get("/professors"),
        ]);

        setCourses(responseCourse.data);
        setProfessors(responseProfessor.data);
    };

    useEffect(()=>{
        getInicitalData();
    },[]);

    const action = [
        {
            name: "Edit",
            action: ({
                id, 
                DayOfWeek,
                StartHour, 
                EndHour,
                professor: {id: professorId},
                department: { id: departmentId },
                course: {id: courseId },
                }) => {
                setAllocation({
                id, 
                DayOfWeek,
                StartHour, 
                EndHour,
                professorId,
                departmentId,
                courseId,
                 });
                setVisible(true);
            }
        },
        {
            name:"Remove",
            action: async (allocation, refetch) => {
                if (window.confirm("Você tem certeza disso?")) {
                  try {
                    await api.delete(`${endpoint}/${allocation.id}`);
                    await refetch();
                    toast.info(`Allocação removida!`);
                  } catch (error) {
                    toast.info(error.message);
                  }
                }
            },
        }
    ]

    const handleSave = async (refetch) => {
        try{
            if(allocation.id){
                await api.put(`${endpoint}/${allocation.id}`,data);

                toast.success("Atualizado com sucesso!");
            }else{
                await api.post(endpoint, data);

                toast.success("Alocação cadastrada com sucesso!");
            }
            setVisible(false);

            await refetch();
        }catch(error){
            toast.info(error.message);
        }
    }
  };

  const onChange = ({target:{name, value }}) =>{
    setAllocation({
        ...allocation,
        [name]: value,
    });
  };

  return(
    <page title="Allocation">
        <Button className="mb-2"
        onClick={()=>{
            setAllocation(INITIAL_STATE);
            setVisible(true);
        }}
        >
            Create Allocation
        </Button>

        <ListView columns={columns} actions={actions} endpoint={endpoint}>
            {({refetch}) => (
                <Modal
                title={`${allocation.id ? "Update": "Create"}Allocation`}
                show={visible}
                handleSave={() => handleSave(refetch)}
                handleClose={() => setVisible(false)}
                >
                    <Form>
                        <Form.Group>
                            <Form.Label>Allocation Day Of Week</Form.Label>
                            <select className="form-control"
                            name="dayOfWeek"
                            onChange={onchange}
                            value={allocation.DayOfWeek}
                            >
                                {daysOfWeek.map(({id, name}, index) =>(
                                    <option key={index} value={id}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label>Start Hour</Form.Label>
                        <Form.Control
                            Name="startHour"
                            onchange={onchange}
                            type="time"
                            value={allocation.StartHour}
                        />
                        </Form.Group>
                    </Form>
                </Modal>
            )
            }
        </ListView>
    </page>
  )

  export default Allocation;