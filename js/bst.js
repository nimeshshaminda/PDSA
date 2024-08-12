class Node {
    constructor(student) {
        this.student = student;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    // Insert a student
    insert(student) {
        const newNode = new Node(student);
        if (this.root === null) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
        this.saveToLocalStorage(); 
    }

    
    // Insert a new student
    insertNode(node, newNode) {
        if (newNode.student.id < node.student.id) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    // Update a student
    update(id, updatedStudent) {
        const studentNode = this.find(id);
        if (studentNode) {
            studentNode.student = updatedStudent;
            this.saveToLocalStorage();  
        } else {
            console.error(`Student with ID ${id} not found.`);
        }
    }
    
    

    // Find a student by ID
    find(id, node = this.root) {
        if (node === null) {
            return null;
        } else if (id < node.student.id) {
            return this.find(id, node.left);
        } else if (id > node.student.id) {
            return this.find(id, node.right);
        } else {
            return node;
        }
    }

    
    // Sort students in ascending order
    inorder(node = this.root, result = []) {
        if (node !== null) {
            this.inorder(node.left, result);
            result.push(node.student);
            this.inorder(node.right, result);
        }
        return result;
    }


    // Remove a student 
    remove(id) {
        this.root = this.removeNode(this.root, id);
        this.saveToLocalStorage();
    }

    removeNode(node, id) {
        if (node === null) {
            return null;
        }

        if (id < node.student.id) {
            node.left = this.removeNode(node.left, id);
        } else if (id > node.student.id) {
            node.right = this.removeNode(node.right, id);
        } else {
            // Node to be deleted found
            if (node.left === null && node.right === null) {
                return null;
            }

            if (node.left === null) {
                return node.right;
            }

            if (node.right === null) {
                return node.left;
            }

            const minRight = this.findMinNode(node.right);
            node.student = minRight.student;
            node.right = this.removeNode(node.right, minRight.student.id);
        }

        return node;
    }

    findMinNode(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }

    
    // Save students to local storage
    saveToLocalStorage() {
        const students = this.inorder();
        localStorage.setItem('studentsBST', JSON.stringify(students));
    }

    loadFromLocalStorage() {
        const students = JSON.parse(localStorage.getItem('studentsBST') || '[]');
        students.forEach(student => this.insert(student));
    }
}