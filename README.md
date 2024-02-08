# Prerequisites

## Install Miniconda

- https://docs.conda.io/projects/miniconda/en/latest

This is how you would install Minicoda on **Linux/WSL2**

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

sudo chmod +x Miniconda3-latest-Linux-x86_64.sh
  
./Miniconda3-latest-Linux-x86_64.sh -b -u
  
source ~/.bashrc
  
conda init

source ~/.bashrc

conda config --set auto_activate_base false
  
source ~/.bashrc

sudo rm Miniconda3-latest-Linux-x86_64.sh
```

## Create and activate conda environemnt

```bash
conda create -y -p ./.conda python=3.10

conda activate ./.conda

python -m pip install --upgrade pip

pip install jupyter ipykernel
```

## Install the rest of the environemnt

- Open the notebook `install-environment.ipynb`.
- In the notebook:
  - Click `Select Kernel` in the top right of the notebook.
  - Select `.conda (Python 3.10.13)` as the kernel.
- Follow the instructions in the notebook.