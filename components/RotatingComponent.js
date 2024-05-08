import { Component, Types } from "ecsy";

class Rotating extends Component {}
Rotating.schema = {
  speed: { default: 1, type: Types.Number },
};

export default Rotating;
